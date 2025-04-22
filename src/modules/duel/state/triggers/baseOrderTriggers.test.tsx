import {
  opponentId,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components'
import {
  chooseTargetMessage,
  opponentTurnTitle,
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
  agentRetaliatesLogMessage,
  boostedLogMessage,
  copiesLogMessage,
  discardLogMessage,
  hasDamagedSelfLogMessage,
  hasPlayedCardLogMessage,
  playedLogMessage,
  playersTurnLogMessage,
  recoveredCostLogMessage,
  reduceStrengthLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  CardBaseKey,
  CardBases,
  ELEVATED_ACOLYTE_SELF_DAMAGE,
  ElevatedAcolyte,
  HammeriteNovice,
  HammeritePriest,
  TEMPLE_GUARD_BOOST,
  TempleGuard,
} from 'src/shared/modules/cards'
import { deepClone } from 'src/shared/shared.utils'

let preloadedDuel: DuelState
let baseName: CardBaseKey

beforeEach(() => {
  jest.useFakeTimers()
  preloadedDuel = deepClone(stackedDuelStateMock)
})

afterEach(() => {
  jest.useRealTimers()
})

describe(HammeriteNovice.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HammeriteNovice'
    base = CardBases[baseName]
  })

  it('should play all copies if another Hammerite is in play', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: {
        deck: [baseName],
        hand: [baseName],
        board: ['TempleGuard'],
      },
    })

    const { fireEvent, act, getByText, getAllByText, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(getAllByText(base.name)).toHaveLength(1)

    act(() => {
      jest.runAllTimers()
    })

    expect(getAllByText(base.name)).toHaveLength(2)

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${preloadedDuel.players[playerId].name}${hasPlayedCardLogMessage}${base.name}`,
    )
    expect(getByRole('log').textContent).toContain(
      `${copiesLogMessage}${base.name}${playedLogMessage}`,
    )

    const { players, cards } = stackedDuelStateMock
    const { name: defendingAgentName, strength } = cards[
      players[opponentId].board[0]
    ] as Agent

    expect(getByRole('log').textContent).toContain(
      `${TempleGuard.name}${agentAttackLogMessage}${defendingAgentName}${reduceStrengthLogMessage}${strength - 1}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByRole('log').textContent).toContain(
      `${base.name}${agentAttackLogMessage}${defendingAgentName}${reduceStrengthLogMessage}${strength - 2}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByRole('log').textContent).toContain(
      `${base.name}${agentAttackLogMessage}${defendingAgentName}${reduceStrengthLogMessage}${strength - 3}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByRole('log').textContent).toContain(
      `${preloadedDuel.players[opponentId].name}${playersTurnLogMessage}`,
    )
  })

  it('should not play any copies if there is no Hammerite is in play', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { deck: [baseName], hand: [baseName] },
    })

    const { fireEvent, getByText, getAllByText, act, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(getAllByText(base.name)).toHaveLength(1)

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${preloadedDuel.players[playerId].name}${hasPlayedCardLogMessage}${base.name}`,
    )
    expect(getByRole('log').textContent).not.toContain(
      `${copiesLogMessage}${base.name}${playedLogMessage}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByRole('log').textContent).toContain(
      `${preloadedDuel.players[opponentId].name}${playersTurnLogMessage}`,
    )
  })

  it('should not play copies from discard or opponent', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { discard: [baseName], hand: [baseName] },
      [opponentId]: { deck: [baseName], hand: [baseName] },
    })

    const { fireEvent, getByText, getAllByText } = renderWithProviders(
      <Board />,
      { preloadedUser, preloadedDuel },
    )

    fireEvent.click(getByText(base.name))

    expect(getAllByText(base.name)).toHaveLength(1)
  })
})

describe(ElevatedAcolyte.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'ElevatedAcolyte'
    base = CardBases[baseName]
  })

  it('should damage self if played alone', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName] },
    })

    const { fireEvent, act, getByText, getByTestId, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    const { players, cards } = preloadedDuel
    const { hand } = players[playerId]

    expect(getByTestId(hand[0]).textContent).toContain(
      `${base.name}${base.strength - ELEVATED_ACOLYTE_SELF_DAMAGE}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${hasDamagedSelfLogMessage}${ELEVATED_ACOLYTE_SELF_DAMAGE}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    const { name: defendingAgentName, strength } = cards[
      players[opponentId].board[0]
    ] as Agent

    expect(getByRole('log').textContent).toContain(
      `${base.name}${agentAttackLogMessage}${defendingAgentName}${reduceStrengthLogMessage}${strength - 1}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByRole('log').textContent).toContain(
      `${preloadedDuel.players[opponentId].name}${playersTurnLogMessage}`,
    )
  })

  it('should damage self if not played next to a Hammerite with higher strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['HammeriteNovice'] },
    })

    const { fireEvent, getByText, getByTestId, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    const { players } = preloadedDuel
    const { hand } = players[playerId]

    expect(getByTestId(hand[0]).textContent).toContain(
      `${base.name}${base.strength - ELEVATED_ACOLYTE_SELF_DAMAGE}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${hasDamagedSelfLogMessage}${ELEVATED_ACOLYTE_SELF_DAMAGE}`,
    )
  })

  it('should not damage self if played next to a Hammerite with higher strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['TempleGuard'] },
    })

    const { fireEvent, getByText, getByTestId, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    const { players } = preloadedDuel
    const { hand } = players[playerId]

    expect(getByTestId(hand[0]).textContent).toContain(
      `${base.name}${base.strength}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).not.toContain(
      `${base.name}${hasDamagedSelfLogMessage}${ELEVATED_ACOLYTE_SELF_DAMAGE}`,
    )
  })
})

describe(TempleGuard.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'TempleGuard'
    base = CardBases[baseName]
  })

  it('should boost self if the opponent has a larger board', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName] },
      [opponentId]: { board: ['Zombie', 'Haunt'] },
    })

    const { fireEvent, getByText, getByTestId, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    const { players } = preloadedDuel
    const { hand } = players[playerId]

    expect(getByTestId(hand[0]).textContent).toContain(
      `${base.name}${base.strength + TEMPLE_GUARD_BOOST}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${boostedLogMessage}${TEMPLE_GUARD_BOOST}`,
    )
  })

  it('should not retaliate when not attacked', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: ['ElevatedAcolyte', baseName] },
      [opponentId]: { board: ['Zombie'] },
    })

    preloadedDuel.players[opponentId].isBot = true
    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttacker = preloadedDuel.cards[opponent.board[0]] as Agent
    const defender = preloadedDuel.cards[player.board[0]] as Agent
    const templeGuard = preloadedDuel.cards[player.board[1]] as Agent

    const { fireEvent, getByRole, act, getByTestId, getByText } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(player.board[1]).textContent).toContain(
      `${templeGuard.name}${templeGuard.strength}`,
    )
    expect(getByTestId(player.board[0]).textContent).toContain(
      `${defender.name}${defender.strength - 1}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${firstAttacker.name}${agentAttackLogMessage}${defender.name}${reduceStrengthLogMessage}${defender.strength - 1}`,
    )
  })

  it('should retaliate when attacked', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: [baseName] },
      [opponentId]: { board: ['Zombie'] },
    })

    preloadedDuel.players[opponentId].isBot = true
    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = preloadedDuel.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = preloadedDuel.cards[templeGuardId] as Agent

    const { fireEvent, act, getByText, getByRole, getByTestId } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(templeGuardId).textContent).toContain(
      `${templeGuard.name}${templeGuard.strength - 1}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(firstAttackerId).textContent).toContain(
      `${firstAttacker.name}${firstAttacker.strength - 1}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${firstAttacker.name}${agentAttackLogMessage}${templeGuard.name}${reduceStrengthLogMessage}${templeGuard.strength - 1}`,
    )
    expect(getByRole('log').textContent).toContain(
      `${templeGuard.name}${agentRetaliatesLogMessage}${firstAttacker.name}`,
    )
  })

  it('should retaliate twice if attacked twice', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: [baseName] },
      [opponentId]: { board: ['Haunt', 'Zombie'] },
    })

    preloadedDuel.players[opponentId].isBot = true
    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const secondAttackerId = opponent.board[1]
    const firstAttacker = preloadedDuel.cards[firstAttackerId] as Agent
    const secondAttacker = preloadedDuel.cards[secondAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = preloadedDuel.cards[templeGuardId] as Agent

    const { fireEvent, act, getByText, getByTestId, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    // First round of attacks
    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(templeGuardId).textContent).toContain(
      `${templeGuard.name}${templeGuard.strength - 1}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(firstAttackerId).textContent).toContain(
      `${firstAttacker.name}${firstAttacker.strength - 1}`,
    )

    // Second round of attacks
    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(templeGuardId).textContent).toContain(
      `${templeGuard.name}${templeGuard.strength - 2}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByTestId(secondAttackerId).textContent).toContain(
      `${secondAttacker.name}${secondAttacker.strength - 1}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${templeGuard.name}${agentRetaliatesLogMessage}${firstAttacker.name}`,
    )
  })
})

describe(HammeritePriest.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HammeritePriest'
    base = CardBases[baseName]
  })

  it('should be able to discard a single card and recover its cost immediately', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: ['TempleGuard'], hand: [baseName] },
    })

    const { fireEvent, act, getByText, getByRole, getByTestId } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    expect(getByText(chooseTargetMessage)).toBeTruthy()

    fireEvent.click(getByText(TempleGuard.name))

    act(() => {
      jest.runAllTimers()
    })

    const { discard, name, coins } = preloadedDuel.players[playerId]
    const { name: opponentName } = preloadedDuel.players[opponentId]

    expect(getByText(`${discardLabel} (${discard.length + 1})`)).toBeTruthy()
    expect(getByTestId(`${playerId}-info`).textContent).not.toContain(
      incomeLabel,
    )
    expect(getByTestId(`${playerId}-info`).textContent).toContain(
      `${name}  ${coins - base.cost + TempleGuard.cost}`,
    )

    act(() => {
      jest.runAllTimers()
    })

    expect(getByText(opponentTurnTitle)).toBeTruthy()

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${TempleGuard.name}${discardLogMessage}`,
    )
    expect(getByRole('log').textContent).toContain(
      `${opponentName}${playersTurnLogMessage}`,
    )
    expect(getByRole('log').textContent).toContain(
      `${base.name}${recoveredCostLogMessage}${TempleGuard.name}`,
    )
  })

  it("should not be able to discard self or cards on opponent's board", () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: ['TempleGuard'], hand: [baseName] },
    })

    const { fireEvent, act, getByText, queryByText, getByRole, getByTestId } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    fireEvent.click(getByText(base.name))

    expect(getByText(chooseTargetMessage)).toBeTruthy()

    const { cards, players } = preloadedDuel
    const { board } = players[opponentId]
    const opponentCardName = cards[board[0]].name

    fireEvent.click(getByText(opponentCardName))
    fireEvent.click(getByText(HammeritePriest.name))

    act(() => {
      jest.runAllTimers()
    })

    const { discard, name, coins } = preloadedDuel.players[playerId]

    expect(queryByText(`${discardLabel} (${discard.length + 1})`)).toBeFalsy()
    expect(getByTestId(`${playerId}-info`).textContent).not.toContain(
      `${name}  ${coins - base.cost + TempleGuard.cost}`,
    )

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).not.toContain(
      `${HammeritePriest.name}${discardLogMessage}`,
    )
    expect(getByRole('log').textContent).not.toContain(
      `${opponentCardName}${discardLogMessage}`,
    )
  })
})
