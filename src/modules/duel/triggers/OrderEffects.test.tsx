import { fireEvent, within } from '@testing-library/dom'
import { act } from 'react'
import { RootState } from 'src/app'
import { normalizePlayerCards } from 'src/modules/duel'
import { Board } from 'src/modules/duel/components'
import {
  initialOpponentMock,
  initialPlayerMock,
  opponentId,
  playerId,
  stackedStateMock,
} from 'src/shared/__mocks__'
import {
  CardBaseName,
  CardBases,
  ElevatedAcolyte,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HighPriestMarkander,
} from 'src/shared/data'
import { renderWithProviders } from 'src/shared/rtlRender'
import { CARD_TEST_ID, PLAYER_BOARD_ID } from 'src/shared/testIds'
import { Agent } from 'src/shared/types'
import { deepClone } from 'src/shared/utils'

jest.useFakeTimers()

let preloadedState: RootState
let baseName: CardBaseName

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

describe('Hammerite Novice', () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HammeriteNovice'
    base = CardBases[baseName]
  })

  it('should play all copies if another Hammerite is in play', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [baseName],
        hand: [baseName],
        board: ['TempleGuard'],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(base.name),
    ).toHaveLength(2)
  })

  it('should not play any copies if there is no Hammerite is in play', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [baseName],
        hand: [baseName],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(base.name),
    ).toHaveLength(1)
  })

  it('should not play copies from discard or opponent', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        discard: [baseName],
        hand: [baseName],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(base.name),
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
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [baseName],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getByRole('heading', { level: 3 }),
    ).toHaveTextContent(`${base.name}${base.strength - 1}`)
  })

  it('should damage self if not played next to a Hammerite with higher strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['HammeriteNovice'],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(
        getByTestId(`${CARD_TEST_ID}${normalizedCards.hand[0]}`),
      ).getByRole('heading', {
        level: 3,
      }),
    ).toHaveTextContent(`${base.name}${base.strength - 1}`)
  })

  it('should not damage self if played next to a Hammerite with higher strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['TempleGuard'],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    expect(
      within(
        getByTestId(`${CARD_TEST_ID}${normalizedCards.hand[0]}`),
      ).getByRole('heading', {
        level: 3,
      }),
    ).toHaveTextContent(`${base.name}${base.strength}`)
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

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    normalizedCards.board.forEach((cardId) => {
      const { strength, name } = normalizedCards.cards[cardId] as Agent

      expect(
        within(getByTestId(`${CARD_TEST_ID}${cardId}`)).getByRole('heading', {
          level: 3,
        }),
      ).toHaveTextContent(
        `${name}${strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
      )
    })
  })

  it('should not boost non-Hammerite agents or Hammerites with highet strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [baseName],
      board: ['HouseGuard', 'TempleGuard'],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(base.name))

    normalizedCards.board.forEach((cardId) => {
      const { strength, name } = normalizedCards.cards[cardId] as Agent

      expect(
        within(getByTestId(`${CARD_TEST_ID}${cardId}`)).getByRole('heading', {
          level: 3,
        }),
      ).toHaveTextContent(`${name}${strength}`)
    })
  })
})

describe('Temple Guard', () => {
  beforeEach(() => {
    baseName = 'TempleGuard'
  })

  it('should not retaliate when not attacked', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: ['ElevatedAcolyte', baseName],
      }),
    }
    preloadedState.duel.activePlayerId = opponentId
    preloadedState.duel.inactivePlayerId = playerId

    const player = preloadedState.duel.players[playerId]
    const opponent = preloadedState.duel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = opponent.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[1]
    const templeGuard = player.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
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
      ),
    ).toHaveTextContent(`${templeGuard.name}${templeGuard.strength}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${firstAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ),
    ).toHaveTextContent(`${firstAttacker.name}${firstAttacker.strength}`)
  })

  it('should retaliate when attacked', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: [baseName],
      }),
    }
    preloadedState.duel.activePlayerId = opponentId
    preloadedState.duel.inactivePlayerId = playerId

    const player = preloadedState.duel.players[playerId]
    const opponent = preloadedState.duel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = opponent.cards[firstAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = player.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
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
      ),
    ).toHaveTextContent(`${templeGuard.name}${templeGuard.strength - 1}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${firstAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ),
    ).toHaveTextContent(`${firstAttacker.name}${firstAttacker.strength - 1}`)
  })

  it('should retaliate twice if attacked twice', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: [baseName],
      }),
    }
    preloadedState.duel.players[opponentId] = {
      ...initialOpponentMock,
      ...normalizePlayerCards({
        hand: [],
        board: ['Haunt', 'Zombie'],
      }),
    }
    preloadedState.duel.activePlayerId = opponentId
    preloadedState.duel.inactivePlayerId = playerId

    const player = preloadedState.duel.players[playerId]
    const opponent = preloadedState.duel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const secondAttackerId = opponent.board[1]
    const firstAttacker = opponent.cards[firstAttackerId] as Agent
    const secondAttacker = opponent.cards[secondAttackerId] as Agent
    const templeGuardId = player.board[0]
    const templeGuard = player.cards[templeGuardId] as Agent

    const { getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
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
      ),
    ).toHaveTextContent(`${templeGuard.name}${templeGuard.strength - 1}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${firstAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ),
    ).toHaveTextContent(`${firstAttacker.name}${firstAttacker.strength - 1}`)

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
      ),
    ).toHaveTextContent(`${templeGuard.name}${templeGuard.strength - 2}`)

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(`${CARD_TEST_ID}${secondAttackerId}`)).getByRole(
        'heading',
        {
          level: 3,
        },
      ),
    ).toHaveTextContent(`${secondAttacker.name}${secondAttacker.strength - 1}`)
  })
})

describe('High Priest Markander', () => {
  let base: Agent

  beforeEach(() => {
    baseName = 'HighPriestMarkander'
    base = CardBases[baseName]
  })

  it('should reduce the counter if a Hammerite is played', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [],
        hand: [baseName, 'ElevatedAcolyte'],
        board: [],
      }),
    }

    const { getByText } = renderWithProviders(<Board />, {
      preloadedState,
    })

    expect(getByText(`Counter: ${base.counter}`)).toBeInTheDocument()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(
      getByText(`Counter: ${(base.counter as number) - 1}`),
    ).toBeInTheDocument()
  })

  it('should play High Priest Markander if counter reaches 0', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      board: [],
      hand: ['1'],
      deck: ['2'],
      cards: {
        '1': ElevatedAcolyte,
        '2': { ...HighPriestMarkander, counter: 1 },
      },
    }

    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <Board />,
      {
        preloadedState,
      },
    )

    expect(queryByText(base.name)).not.toBeInTheDocument()

    fireEvent.click(getByText(ElevatedAcolyte.name))

    act(() => {
      jest.runAllTimers()
    })

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(base.name),
    ).toHaveLength(1)
  })
})
