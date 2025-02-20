import { fireEvent, within } from '@testing-library/dom'
import { act } from 'react'
import {
  DuelState,
  normalizePlayerCards,
  renderWithProviders,
} from 'src/modules/duel'
import { Board } from 'src/modules/duel/components'
import {
  initialOpponentMock,
  initialPlayerMock,
  opponentId,
  playerId,
  userMock as preloadedUser,
  stackedDuelStateMock,
} from 'src/shared/__mocks__'
import {
  CardBaseName,
  CardBases,
  ElevatedAcolyte,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HighPriestMarkander,
} from 'src/shared/data'
import { CARD_TEST_ID } from 'src/shared/test'
import { Agent } from 'src/shared/types'
import { deepClone } from 'src/shared/utils'

jest.useFakeTimers()

let preloadedDuel: DuelState
let baseName: CardBaseName

beforeEach(() => {
  preloadedDuel = deepClone(stackedDuelStateMock)
})

describe('Hammerite Novice', () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HammeriteNovice'
    base = CardBases[baseName]
  })

  it('should play all copies if another Hammerite is in play', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [baseName],
        hand: [baseName],
        board: ['TempleGuard'],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(`${playerId}-board`)).getAllByText(base.name),
    ).toHaveLength(2)
  })

  it('should not play any copies if there is no Hammerite is in play', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [baseName],
        hand: [baseName],
      }),
    }

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
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        discard: [baseName],
        hand: [baseName],
      }),
    }

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
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [baseName],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(`${playerId}-board`)).getByRole('heading', {
        level: 3,
      }).textContent,
    ).toContain(`${base.name}${base.strength - 1}`)
  })

  it('should damage self if not played next to a Hammerite with higher strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['HammeriteNovice'],
    })

    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      getByTestId(`${CARD_TEST_ID}${normalizedCards.hand[0]}`).textContent,
    ).toContain(`${base.name}${base.strength - 1}`)
  })

  it('should not damage self if played next to a Hammerite with higher strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['TempleGuard'],
    })

    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(
        getByTestId(`${CARD_TEST_ID}${normalizedCards.hand[0]}`),
      ).getByRole('heading', {
        level: 3,
      }).textContent,
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
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['HammeriteNovice', 'HammeriteNovice'],
    })

    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    normalizedCards.board.forEach((cardId) => {
      const { strength, name } = normalizedCards.cards[cardId] as Agent

      expect(
        within(getByTestId(`${CARD_TEST_ID}${cardId}`)).getByRole('heading', {
          level: 3,
        }).textContent,
      ).toContain(`${name}${strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`)
    })
  })

  it('should not boost non-Hammerite agents or Hammerites with highet strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['HouseGuard', 'TempleGuard'],
    })

    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    fireEvent.click(getByText(base.name))

    normalizedCards.board.forEach((cardId) => {
      const { strength, name } = normalizedCards.cards[cardId] as Agent

      expect(
        within(getByTestId(`${CARD_TEST_ID}${cardId}`)).getByRole('heading', {
          level: 3,
        }).textContent,
      ).toContain(`${name}${strength}`)
    })
  })
})

describe('Temple Guard', () => {
  beforeEach(() => {
    baseName = 'TempleGuard'
  })

  it('should not retaliate when not attacked', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: ['ElevatedAcolyte', baseName],
      }),
    }
    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = opponent.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[1]
    const templeGuard = player.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${templeGuardId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${firstAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${firstAttacker.name}${firstAttacker.strength}`)
  })

  it('should retaliate when attacked', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: [baseName],
      }),
    }
    preloadedDuel.players[opponentId] = {
      ...initialOpponentMock,
      ...normalizePlayerCards({
        hand: [],
        board: ['Zombie'],
      }),
    }
    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = opponent.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = player.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${templeGuardId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength - 1}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${firstAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${firstAttacker.name}${firstAttacker.strength - 1}`)
  })

  it('should retaliate twice if attacked twice', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: [baseName],
      }),
    }
    preloadedDuel.players[opponentId] = {
      ...initialOpponentMock,
      ...normalizePlayerCards({
        hand: [],
        board: ['Haunt', 'Zombie'],
      }),
    }
    preloadedDuel.playerOrder = [opponentId, playerId]

    const player = preloadedDuel.players[playerId]
    const opponent = preloadedDuel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const secondAttackerId = opponent.board[1]
    const firstAttacker = opponent.cards[firstAttackerId] as Agent
    const secondAttacker = opponent.cards[secondAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = player.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    // First round of attacks
    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${templeGuardId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength - 1}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${firstAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${firstAttacker.name}${firstAttacker.strength - 1}`)

    // Second round of attacks
    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${templeGuardId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${templeGuard.name}${templeGuard.strength - 2}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${secondAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ).textContent,
    ).toContain(`${secondAttacker.name}${secondAttacker.strength - 1}`)
  })
})

describe('High Priest Markander', () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HighPriestMarkander'
    base = CardBases[baseName]
  })

  it('should reduce the counter if a Hammerite is played', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [],
        hand: [baseName, 'ElevatedAcolyte'],
        board: [],
      }),
    }

    const { getByText } = renderWithProviders(<Board />, {
      preloadedUser,
      preloadedDuel,
    })

    expect(getByText(`Counter: ${base.counter}`)).toBeTruthy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(getByText(`Counter: ${(base.counter as number) - 1}`)).toBeTruthy()
  })

  it('should play High Priest Markander if counter reaches 0', () => {
    preloadedDuel.players[playerId] = {
      ...initialPlayerMock,
      board: [],
      hand: ['1'],
      deck: ['2'],
      cards: {
        '1': { id: '1', ...ElevatedAcolyte },
        '2': { ...HighPriestMarkander, id: '2', counter: 1 },
      },
    }

    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <Board />,
      {
        preloadedUser,
        preloadedDuel,
      },
    )

    expect(queryByText(base.name)).not.toBeTruthy()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    expect(
      within(getByTestId(`${playerId}-board`)).getAllByText(base.name),
    ).toHaveLength(1)
  })
})
