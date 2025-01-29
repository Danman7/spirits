import { fireEvent, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { act } from 'react'
import { RootState } from 'src/app/store'
import { Board } from 'src/modules/duel/components'
import { normalizePlayerCards } from 'src/modules/duel/utils'
import {
  initialOpponentMock,
  initialPlayerMock,
  opponentId,
  playerId,
  stackedStateMock,
} from 'src/shared/__mocks__'
import {
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  Haunt,
  HouseGuard,
  TempleGuard,
  Zombie,
} from 'src/shared/data'
import { renderWithProviders } from 'src/shared/rtlRender'
import { CARD_TEST_ID, PLAYER_BOARD_ID } from 'src/shared/testIds'
import { deepClone } from 'src/shared/utils'

jest.useFakeTimers()

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

describe(HammeriteNovice.name, () => {
  it('should play all copies if another Hammerite is in play', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [HammeriteNovice],
        hand: [HammeriteNovice],
        board: [TempleGuard],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(HammeriteNovice.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(HammeriteNovice.name),
    ).toHaveLength(2)
  })

  it('should not play any copies if there is no Hammerite is in play', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [HammeriteNovice],
        hand: [HammeriteNovice],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(HammeriteNovice.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(HammeriteNovice.name),
    ).toHaveLength(1)
  })

  it('should not play copies from discard or opponent', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        discard: [HammeriteNovice],
        hand: [HammeriteNovice],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(HammeriteNovice.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getAllByText(HammeriteNovice.name),
    ).toHaveLength(1)
  })
})

describe(ElevatedAcolyte.name, () => {
  it('should damage self if played alone', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [ElevatedAcolyte],
      }),
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(ElevatedAcolyte.name))

    expect(
      within(getByTestId(PLAYER_BOARD_ID)).getByRole('heading', { level: 3 }),
    ).toHaveTextContent(
      `${ElevatedAcolyte.name}${ElevatedAcolyte.strength - 1}`,
    )
  })

  it('should damage self if not played next to a Hammerite with higher strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [ElevatedAcolyte],
      board: [HammeriteNovice],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(ElevatedAcolyte.name))

    expect(
      within(
        getByTestId(`${CARD_TEST_ID}${normalizedCards.hand[0]}`),
      ).getByRole('heading', {
        level: 3,
      }),
    ).toHaveTextContent(
      `${ElevatedAcolyte.name}${ElevatedAcolyte.strength - 1}`,
    )
  })

  it('should not damage self if played next to a Hammerite with higher strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [ElevatedAcolyte],
      board: [TempleGuard],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(ElevatedAcolyte.name))

    expect(
      within(
        getByTestId(`${CARD_TEST_ID}${normalizedCards.hand[0]}`),
      ).getByRole('heading', {
        level: 3,
      }),
    ).toHaveTextContent(`${ElevatedAcolyte.name}${ElevatedAcolyte.strength}`)
  })
})

describe(BrotherSachelman.name, () => {
  it('should boost all allied Hammerites on board that have lower strength', () => {
    const normalizedCards = normalizePlayerCards({
      hand: [BrotherSachelman],
      board: [HammeriteNovice, HammeriteNovice],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(BrotherSachelman.name))

    normalizedCards.board.forEach((cardId) => {
      const { name, strength } = normalizedCards.cards[cardId]

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
      hand: [BrotherSachelman],
      board: [HouseGuard, TempleGuard],
    })

    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizedCards,
    }

    const { getByText, getByTestId } = renderWithProviders(<Board />, {
      preloadedState,
    })

    fireEvent.click(getByText(BrotherSachelman.name))

    normalizedCards.board.forEach((cardId) => {
      const { name, strength } = normalizedCards.cards[cardId]

      expect(
        within(getByTestId(`${CARD_TEST_ID}${cardId}`)).getByRole('heading', {
          level: 3,
        }),
      ).toHaveTextContent(`${name}${strength}`)
    })
  })
})

describe(TempleGuard.name, () => {
  it('should not retaliate when not attacked', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        hand: [],
        board: [ElevatedAcolyte, TempleGuard],
      }),
    }
    preloadedState.duel.activePlayerId = opponentId

    const player = preloadedState.duel.players[playerId]
    const opponent = preloadedState.duel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = opponent.cards[firstAttackerId]
    const templeGuardId = player.board[1]
    const templeGuard = player.cards[templeGuardId]

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
        board: [TempleGuard],
      }),
    }
    preloadedState.duel.activePlayerId = opponentId

    const player = preloadedState.duel.players[playerId]
    const opponent = preloadedState.duel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const firstAttacker = opponent.cards[firstAttackerId]
    const templeGuardId = player.board[0]
    const templeGuard = player.cards[templeGuardId]

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
        board: [TempleGuard],
      }),
    }
    preloadedState.duel.players[opponentId] = {
      ...initialOpponentMock,
      ...normalizePlayerCards({
        hand: [],
        board: [Haunt, Zombie],
      }),
    }
    preloadedState.duel.activePlayerId = opponentId

    const player = preloadedState.duel.players[playerId]
    const opponent = preloadedState.duel.players[opponentId]
    const firstAttackerId = opponent.board[0]
    const secondAttackerId = opponent.board[1]
    const firstAttacker = opponent.cards[firstAttackerId]
    const secondAttacker = opponent.cards[secondAttackerId]
    const templeGuardId = player.board[0]
    const templeGuard = player.cards[templeGuardId]

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
