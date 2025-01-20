import { fireEvent, within } from '@testing-library/dom'
import { RootState } from 'src/app/store'
import { Board } from 'src/features/duel/components'
import { normalizePlayerCards } from 'src/features/duel/utils'
import {
  initialPlayerMock,
  playerId,
  stackedStateMock,
} from 'src/shared/__mocks__'
import { HammeriteNovice, TempleGuard } from 'src/shared/CardBases'
import { renderWithProviders } from 'src/shared/rtlRender'
import { PLAYER_BOARD_ID } from 'src/shared/testIds'
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
