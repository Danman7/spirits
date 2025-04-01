import { fireEvent, waitFor, within } from '@testing-library/dom'
import { act } from 'react'
import {
  initialDuelStateMock,
  opponentId,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/__mocks__/duelMocks'
import { Board } from 'src/modules/duel/components/Board'
import { renderWithProviders } from 'src/modules/duel/duelTestRender'
import { normalizeStateCards } from 'src/modules/duel/duelUtils'
import {
  agentRetaliatesLogMessage,
  boostedLogMessage,
  copiesLogMessage,
  hasDamagedSelfLogMessage,
  hasPlayedCardLogMessage,
  isPlayedLogMessage,
  playedLogMessage,
} from 'src/modules/duel/state/duelStateMessages'
import { DuelState } from 'src/modules/duel/state/duelStateTypes'
import {
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  TEMPLE_GUARD_BOOST,
} from 'src/shared/modules/cards/CardConstants'
import { Agent, CardBaseKey } from 'src/shared/modules/cards/CardTypes'
import {
  CardBases,
  ElevatedAcolyte,
  HighPriestMarkander,
} from 'src/shared/modules/cards/data/bases'
import { deepClone } from 'src/shared/SharedUtils'
import {
  CARD_TEST_ID,
  LOGS_CONTENT,
  OPEN_LOGS_ICON,
} from 'src/shared/test/testIds'

jest.useFakeTimers()

let preloadedDuel: DuelState
let baseName: CardBaseKey

beforeEach(() => {
  preloadedDuel = deepClone(stackedDuelStateMock)
})

describe('Hammerite Novice', () => {
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

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    await waitFor(() => {
      expect(
        within(getByTestId(`${playerId}-board`)).getAllByText(base.name),
      ).toHaveLength(2)
    })

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${hasPlayedCardLogMessage}${base.name}`,
    )
    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${copiesLogMessage}${base.name}${playedLogMessage}`,
    )
  })

  it('should not play any copies if there is no Hammerite is in play', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { deck: [baseName], hand: [baseName] },
    })

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(`${playerId}-board`)).getAllByText(base.name),
    ).toHaveLength(1)
  })

  it('should not play copies from discard or opponent', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { discard: [baseName], hand: [baseName] },
    })

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(`${playerId}-board`)).getAllByText(base.name),
    ).toHaveLength(1)
  })
})

describe('Elevated Acolyte', () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'ElevatedAcolyte'
    base = CardBases[baseName]
  })

  it('should damage self if played alone', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName] },
    })

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(getByTestId(`${playerId}-board`).textContent).toContain(
      `${base.name}${base.strength - 1}`,
    )

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${base.name}${hasDamagedSelfLogMessage}1`,
    )
  })

  it('should damage self if not played next to a Hammerite with higher strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['HammeriteNovice'] },
    })

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      getByTestId(`${CARD_TEST_ID}${preloadedDuel.players[playerId].hand[0]}`)
        .textContent,
    ).toContain(`${base.name}${base.strength - 1}`)
  })

  it('should not damage self if played next to a Hammerite with higher strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['TempleGuard'] },
    })

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      getByTestId(`${CARD_TEST_ID}${preloadedDuel.players[playerId].hand[0]}`)
        .textContent,
    ).toContain(`${base.name}${base.strength}`)
  })
})

describe('Brother Sachelman', () => {
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

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    preloadedDuel.players[playerId].board.forEach((cardId) => {
      const { strength, name } = preloadedDuel.cards[cardId] as Agent

      expect(getByTestId(`${CARD_TEST_ID}${cardId}`).textContent).toContain(
        `${name}${strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )

      expect(getByTestId(LOGS_CONTENT).textContent).toContain(
        `${name}${boostedLogMessage}${HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )
    })
  })

  it('should not boost non-Hammerite agents or Hammerites with highet strength', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { hand: [baseName], board: ['HouseGuard', 'TempleGuard'] },
    })

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    preloadedDuel.players[playerId].board.forEach((cardId) => {
      const { strength, name } = preloadedDuel.cards[cardId] as Agent

      expect(getByTestId(`${CARD_TEST_ID}${cardId}`).textContent).toContain(
        `${name}${strength}`,
      )
    })
  })
})

describe('Temple Guard', () => {
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

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(getByTestId(`${playerId}-board`).textContent).toContain(
      `${base.name}${base.strength + TEMPLE_GUARD_BOOST}`,
    )

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${base.name}${boostedLogMessage}${TEMPLE_GUARD_BOOST}`,
    )
  })

  it('should not retaliate when not attacked', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: ['ElevatedAcolyte', baseName] },
      [opponentId]: { board: ['Zombie'] },
    })

    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = preloadedDuel.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[1]
    const templeGuard = preloadedDuel.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${templeGuardId}`).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${firstAttackerId}`).textContent,
    ).toContain(`${firstAttacker.name}${firstAttacker.strength}`)
  })

  it('should retaliate when attacked', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: [baseName] },
      [opponentId]: { board: ['Zombie'] },
    })

    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = preloadedDuel.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = preloadedDuel.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${templeGuardId}`).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength - 1}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${firstAttackerId}`).textContent,
    ).toContain(`${firstAttacker.name}${firstAttacker.strength - 1}`)

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${templeGuard.name}${agentRetaliatesLogMessage}${firstAttacker.name}`,
    )
  })

  it('should retaliate twice if attacked twice', () => {
    preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
      [playerId]: { board: [baseName] },
      [opponentId]: { board: ['Haunt', 'Zombie'] },
    })

    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const secondAttackerId = opponent.board[1]
    const firstAttacker = preloadedDuel.cards[firstAttackerId] as Agent
    const secondAttacker = preloadedDuel.cards[secondAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = preloadedDuel.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    // First round of attacks
    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${templeGuardId}`).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength - 1}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${firstAttackerId}`).textContent,
    ).toContain(`${firstAttacker.name}${firstAttacker.strength - 1}`)

    // Second round of attacks
    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${templeGuardId}`).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength - 2}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByTestId(`${CARD_TEST_ID}${secondAttackerId}`).textContent,
    ).toContain(`${secondAttacker.name}${secondAttacker.strength - 1}`)
  })
})

describe('High Priest Markander', () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HighPriestMarkander'
    base = CardBases[baseName]
  })

  /** This single test is extremely flaky */

  // it('should reduce the counter if a Hammerite is played', async () => {
  //   preloadedDuel = normalizeStateCards(stackedDuelStateMock, {
  //     [playerId]: {
  //       hand: [baseName, 'ElevatedAcolyte'],
  //     },
  //   })

  //   const { getByText, getByTestId } = renderWithProviders(<Board />, {
  //     preloadedUser,
  //     preloadedDuel,
  //   })

  //   expect(getByText(base.counter as number)).toBeTruthy()

  //   fireEvent.click(getByText(ElevatedAcolyte.name))

  //   act(() => {
  //     jest.runAllTimers()
  //   })

  //   const expectedReducedCounter = (base.counter as number) - 1

  //   await waitFor(() => {
  //     expect(getByText(expectedReducedCounter)).toBeTruthy()
  //   })

  //   fireEvent.click(getByTestId(OPEN_LOGS_ICON))

  //   expect(getByTestId(LOGS_CONTENT).textContent).toContain(
  //     `${base.name}${reduceCounterLogMessage}${expectedReducedCounter}`,
  //   )
  // })

  it('should play High Priest Markander if counter reaches 0', async () => {
    preloadedDuel.players[playerId] = {
      ...deepClone(initialDuelStateMock.players[playerId]),
      board: [],
      hand: ['1'],
      deck: ['2'],
    }

    preloadedDuel.cards = {
      ...deepClone(preloadedDuel.cards),
      '1': { id: '1', ...ElevatedAcolyte },
      '2': { ...HighPriestMarkander, id: '2', counter: 1 },
    }

    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <Board />,
      { preloadedUser, preloadedDuel },
    )

    expect(queryByText(base.name)).not.toBeTruthy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    await waitFor(() => {
      expect(
        within(getByTestId(`${playerId}-board`)).getAllByText(base.name),
      ).toHaveLength(1)
    })

    fireEvent.click(getByTestId(OPEN_LOGS_ICON))

    expect(getByTestId(LOGS_CONTENT).textContent).toContain(
      `${base.name}${isPlayedLogMessage}`,
    )
  })
})
