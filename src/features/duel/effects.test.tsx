import { fireEvent } from '@testing-library/dom'
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

    const { getByText, getAllByText } = renderWithProviders(<Board />, {
      preloadedState,
    })

    expect(getAllByText(HammeriteNovice.name)).toHaveLength(1)

    fireEvent.click(getByText(HammeriteNovice.name))

    expect(getAllByText(HammeriteNovice.name)).toHaveLength(2)
  })

  it('should not play any copies if there is no Hammerite is in play', () => {
    preloadedState.duel.players[playerId] = {
      ...initialPlayerMock,
      ...normalizePlayerCards({
        deck: [HammeriteNovice],
        hand: [HammeriteNovice],
        board: [],
      }),
    }

    const { getByText, getAllByText } = renderWithProviders(<Board />, {
      preloadedState,
    })

    expect(getAllByText(HammeriteNovice.name)).toHaveLength(1)

    fireEvent.click(getByText(HammeriteNovice.name))

    expect(getAllByText(HammeriteNovice.name)).toHaveLength(1)
  })
})
