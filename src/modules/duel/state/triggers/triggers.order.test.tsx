import {
  opponentId,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components'
import { logsTitle } from 'src/modules/duel/components/Board/PlayerField/LogsPanel/LogsPanel.messages'
import { normalizeStateCards } from 'src/modules/duel/duel.utils'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { DuelState } from 'src/modules/duel/state'
import {
  agentAttackLogMessage,
  agentRetaliatesLogMessage,
  boostedLogMessage,
  copiesLogMessage,
  hasDamagedSelfLogMessage,
  hasPlayedCardLogMessage,
  isPlayedLogMessage,
  playedLogMessage,
  playersTurnLogMessage,
  reduceCounterLogMessage,
  reduceStrengthLogMessage,
} from 'src/modules/duel/state/playLogs'

import {
  Agent,
  AgentWithCounter,
  BrotherSachelman,
  CardBaseKey,
  CardBases,
  ELEVATED_ACOLYTE_SELF_DAMAGE,
  ElevatedAcolyte,
  HammeriteNovice,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HighPriestMarkander,
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

    expect(getAllByText(base.name)).toHaveLength(2)

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${preloadedDuel.players[playerId].name}${hasPlayedCardLogMessage}${base.name}`,
    )
    expect(getByRole('log').textContent).toContain(
      `${copiesLogMessage}${base.name}${playedLogMessage}`,
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

    const { players } = preloadedDuel
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

describe(BrotherSachelman.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'BrotherSachelman'
    base = CardBases[baseName]
  })

  it('should boost all allied Hammerites on board that have lower strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: {
        hand: [baseName],
        board: ['HammeriteNovice', 'HammeriteNovice'],
      },
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

    preloadedDuel.players[playerId].board.forEach((cardId) => {
      const { strength, name } = preloadedDuel.cards[cardId] as Agent

      expect(getByTestId(cardId).textContent).toContain(
        `${name}${strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )

      expect(getByRole('log').textContent).toContain(
        `${name}${boostedLogMessage}${HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )
    })
  })

  it('should not boost non-Hammerite agents or Hammerites with highet strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['HouseGuard', 'TempleGuard'] },
    })

    const { fireEvent, getByText, getByTestId } = renderWithProviders(
      <Board />,
      { preloadedUser, preloadedDuel },
    )

    fireEvent.click(getByText(base.name))

    preloadedDuel.players[playerId].board.forEach((cardId) => {
      const { strength, name } = preloadedDuel.cards[cardId] as Agent

      expect(getByTestId(cardId).textContent).toContain(`${name}${strength}`)
    })
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

describe(HighPriestMarkander.name, () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HighPriestMarkander'
    base = CardBases[baseName]
  })

  it('should reduce the counter if a Hammerite is played', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName, 'ElevatedAcolyte'] },
    })

    const { fireEvent, act, getByRole, getByText } = renderWithProviders(
      <Board />,
      { preloadedUser, preloadedDuel },
    )

    expect(getByText(base.counter as number)).toBeTruthy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    const expectedReducedCounter = (base.counter as number) - 1

    expect(getByText(expectedReducedCounter)).toBeTruthy()

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${reduceCounterLogMessage}${expectedReducedCounter}`,
    )
  })

  it('should play High Priest Markander from deck if counter reaches 0', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: ['ElevatedAcolyte'], deck: [baseName] },
    })

    const HighPriestId = preloadedDuel.players[playerId].deck[0]
    const HighPriest = preloadedDuel.cards[HighPriestId] as AgentWithCounter

    HighPriest.counter = 1

    const { fireEvent, act, getAllByText, getByText, queryByText, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    expect(queryByText(base.name)).toBeFalsy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(getAllByText(base.name)).toHaveLength(1)

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).toContain(
      `${base.name}${isPlayedLogMessage}`,
    )
  })

  it('should not play High Priest Markander from discard if counter reaches 0', async () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: ['ElevatedAcolyte'], discard: [baseName] },
    })

    const HighPriestId = preloadedDuel.players[playerId].discard[0]
    const HighPriest = preloadedDuel.cards[HighPriestId] as AgentWithCounter

    HighPriest.counter = 1

    const { fireEvent, act, getByText, queryByText, getByRole } =
      renderWithProviders(<Board />, { preloadedUser, preloadedDuel })

    expect(queryByText(base.name)).toBeFalsy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(queryByText(base.name)).toBeFalsy()

    fireEvent.click(getByText(logsTitle))

    expect(getByRole('log').textContent).not.toContain(
      `${base.name}${isPlayedLogMessage}`,
    )
  })
})
