import { fireEvent, within } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { RootState } from 'src/app/store'
import { Board } from 'src/modules/duel/components'
import { normalizePlayerCards } from 'src/modules/duel/utils'
import {
  initialPlayerMock,
  playerId,
  stackedStateMock,
} from 'src/shared/__mocks__'
import {
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  HouseGuard,
  TempleGuard,
} from 'src/shared/CardBases'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/shared/constants'
import { renderWithProviders } from 'src/shared/rtlRender'
import { CARD_TEST_ID, PLAYER_BOARD_ID } from 'src/shared/testIds'
import { deepClone } from 'src/shared/utils'

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
