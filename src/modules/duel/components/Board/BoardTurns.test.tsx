import { act } from 'react'

import {
  opponentId,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components/Board/Board'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'
import { logsTitle } from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import {
  discardLabel,
  incomeLabel,
} from 'src/modules/duel/components/Board/PlayerField/PlayerField.messages'
import { normalizeStateCards } from 'src/modules/duel/duel.utils'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state'
import {
  agentAttackLogMessage,
  discardLogMessage,
  hasPlayedCardLogMessage,
  playerSkippedTurnLogMessage,
  playersTurnLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/playLogs'

import { Agent } from 'src/shared/modules/cards'
import { deepClone } from 'src/shared/shared.utils'

let preloadedDuel: DuelState

beforeEach(() => {
  preloadedDuel = deepClone(stackedDuelStateMock)
  jest.useFakeTimers()
})

afterEach(() => {
  jest.useRealTimers()
})

it("should show the action panel when it's the player's turn and he hasn't performed an action", () => {
  const { getByText } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  expect(getByText(yourTurnTitle)).toBeTruthy()
  expect(getByText(passButtonMessage)).toBeTruthy()
  expect(getByText(yourTurnMessage.trim(), { exact: false })).toBeTruthy()
})

it('should be able to pass the turn', () => {
  preloadedDuel.phase = 'Player Turn'

  const { fireEvent, getByText, getByRole } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  const {
    playerOrder: [activePlayerId, inactivePlayerId],
    players,
  } = preloadedDuel
  const activePlayer = players[activePlayerId]
  const inactivePlayer = players[inactivePlayerId]

  fireEvent.click(getByText(passButtonMessage))

  act(() => {
    jest.runAllTimers()
  })

  expect(getByText(opponentTurnTitle)).toBeTruthy()
  expect(getByText(opponentDecidingMessage)).toBeTruthy()

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${activePlayer.name}${playerSkippedTurnLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${inactivePlayer.name}${playersTurnLogMessage}`,
  )
})

it('should be able to play an agent', () => {
  const { fireEvent, getByText, getByRole, getByTestId } = renderWithProviders(
    <Board />,
    { preloadedUser, preloadedDuel },
  )

  const { hand, name: playerName, coins } = preloadedDuel.players[playerId]
  const { name: playedCardName, cost } = preloadedDuel.cards[hand[0]]

  fireEvent.click(getByText(playedCardName))

  expect(getByTestId(`${playerId}-info`).textContent).toContain(
    `${name}  ${coins - cost}-${cost}`,
  )

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${playerName}${hasPlayedCardLogMessage}${playedCardName} for ${cost}`,
  )
})

it('should discard an instant when one is played', async () => {
  const {
    fireEvent,
    act,
    getByText,
    getByRole,
    queryByText,
    getAllByText,
    getByTestId,
  } = renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

  const {
    players,
    playerOrder: [activePlayerId, inactvePlayerId],
    cards,
  } = preloadedDuel
  const { discard, hand, name } = players[activePlayerId]
  const { name: playerCardName, cost } = cards[hand[1]]

  fireEvent.click(getByText(playerCardName))

  act(() => {
    jest.runAllTimers()
  })

  expect(queryByText(playerCardName)).toBeFalsy()

  expect(
    getAllByText(`${discardLabel} (${discard.length + 1})`).length,
  ).toBeTruthy()

  expect(getByTestId(`${playerId}-info`).textContent).toContain(
    `${incomeLabel}${cost}`,
  )

  act(() => {
    jest.runAllTimers()
  })

  expect(getByText(opponentTurnTitle)).toBeTruthy()

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${name}${hasPlayedCardLogMessage}${playerCardName}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${playerCardName}${discardLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${players[inactvePlayerId].name}${playersTurnLogMessage}`,
  )
})

it('should attack the opponent with an agent if their board is empty', () => {
  const defenderId = preloadedDuel.playerOrder[1]

  preloadedDuel.players[defenderId].board = []

  const { fireEvent, act, getByText, getByRole, getByTestId } =
    renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

  fireEvent.click(getByText(passButtonMessage))

  const { players } = preloadedDuel
  const { name, coins } = players[defenderId]

  expect(getByTestId(`${defenderId}-info`).textContent).toContain(
    `${name}  ${coins - 1}-1`,
  )

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${name}${reducingCoinsLogMessage}${coins - 1}`,
  )

  act(() => {
    jest.runAllTimers()
  })

  expect(getByText(opponentTurnTitle)).toBeTruthy()
  expect(getByRole('log').textContent).toContain(
    `${name}${playersTurnLogMessage}`,
  )
})

it('should attack an agent with an agent on the opposite slot', () => {
  const { fireEvent, getByText, getByRole, getByTestId } = renderWithProviders(
    <Board />,
    { preloadedUser, preloadedDuel },
  )

  fireEvent.click(getByText(passButtonMessage))

  const {
    players,
    playerOrder: [activePlayerId, inactivePlayerId],
  } = preloadedDuel
  const { board: attackerBoard } = players[activePlayerId]
  const { board: defenderBoard } = players[inactivePlayerId]
  const attackingAgentId = attackerBoard[0]
  const defendingAgentId = defenderBoard[0]
  const { name: attackerName } = preloadedDuel.cards[attackingAgentId] as Agent
  const { name, strength } = preloadedDuel.cards[defendingAgentId] as Agent

  expect(getByTestId(defendingAgentId).textContent).toContain(
    `${name}${strength - 1}`,
  )

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${attackerName}${agentAttackLogMessage}${name}${reduceStrengthLogMessage}${strength - 1}`,
  )
})

it('should attack an agent with an agent on the previous slot', () => {
  preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
    [playerId]: { board: ['HammeriteNovice', 'TempleGuard'] },
    [opponentId]: { board: ['Zombie'] },
  })

  const { fireEvent, getByText, getByRole, getByTestId } = renderWithProviders(
    <Board />,
    { preloadedUser, preloadedDuel },
  )

  fireEvent.click(getByText(passButtonMessage))

  const {
    players,
    playerOrder: [activePlayerId, inactivePlayerId],
  } = preloadedDuel
  const { board: attackerBoard } = players[activePlayerId]
  const { board: defenderBoard } = players[inactivePlayerId]
  const attackingAgentId = attackerBoard[0]
  const secondAttackingAgentId = attackerBoard[1]
  const defendingAgentId = defenderBoard[0]
  const { name: attackerName } = preloadedDuel.cards[attackingAgentId] as Agent
  const { name: secondAttackerName } = preloadedDuel.cards[
    secondAttackingAgentId
  ] as Agent
  const { name, strength } = preloadedDuel.cards[defendingAgentId] as Agent

  act(() => {
    jest.runAllTimers()
  })

  expect(getByTestId(defendingAgentId).textContent).toContain(
    `${name}${strength - 2}`,
  )

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${attackerName}${agentAttackLogMessage}${name}${reduceStrengthLogMessage}${strength - 1}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${secondAttackerName}${agentAttackLogMessage}${name}${reduceStrengthLogMessage}${strength - 2}`,
  )
})

it('should discard an agent when its strength reaches 0', () => {
  const {
    players,
    playerOrder: [activePlayerId, inactivePlayerId],
  } = preloadedDuel

  const { board: attackerBoard } = players[activePlayerId]
  const {
    board: defenderBoard,
    discard: defenderDiscard,
    name: defendingPlayerName,
  } = players[inactivePlayerId]
  const attackingAgentId = attackerBoard[0]
  const defendingAgentId = defenderBoard[0]
  const { name: attackerName } = preloadedDuel.cards[attackingAgentId] as Agent
  const defender = preloadedDuel.cards[defendingAgentId] as Agent

  defender.strength = 1

  const { fireEvent, getByText, getByRole, getByTestId } = renderWithProviders(
    <Board />,
    { preloadedUser, preloadedDuel },
  )

  fireEvent.click(getByText(passButtonMessage))

  expect(getByTestId(defendingAgentId).textContent).toContain(
    `${defender.name}0`,
  )

  act(() => {
    jest.runAllTimers()
  })

  expect(
    getByText(`${discardLabel} (${defenderDiscard.length + 1})`),
  ).toBeTruthy()

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${attackerName}${agentAttackLogMessage}${defender.name}${reduceStrengthLogMessage}${defender.strength - 1}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${defender.name}${discardLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${defendingPlayerName}${playersTurnLogMessage}`,
  )
})

it('should advance the turn if the board is empty', () => {
  preloadedDuel.phase = 'Player Turn'
  preloadedDuel.players[playerId].board = []
  preloadedDuel.players[opponentId].board = []

  const { fireEvent, getByText, getByRole } = renderWithProviders(<Board />, {
    preloadedUser,
    preloadedDuel,
  })

  const {
    playerOrder: [activePlayerId, inactivePlayerId],
    players,
  } = preloadedDuel
  const activePlayer = players[activePlayerId]
  const inactivePlayer = players[inactivePlayerId]

  fireEvent.click(getByText(passButtonMessage))

  act(() => {
    jest.runAllTimers()
  })

  expect(getByText(opponentTurnTitle)).toBeTruthy()
  expect(getByText(opponentDecidingMessage)).toBeTruthy()

  fireEvent.click(getByText(logsTitle))

  expect(getByRole('log').textContent).toContain(
    `${activePlayer.name}${playerSkippedTurnLogMessage}`,
  )
  expect(getByRole('log').textContent).toContain(
    `${inactivePlayer.name}${playersTurnLogMessage}`,
  )
})
