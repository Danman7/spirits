import { fireEvent } from '@testing-library/dom'
import { RootState } from 'src/app'
import { StackBrowseModal } from 'src/modules/duel/components'
import { closeMessage, setIsBrowsingStack } from 'src/modules/duel'
import { stackedStateMock } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

it("should be able to browse the player's deck", () => {
  preloadedState.duel.isBrowsingStack = true

  const { getByText, dispatchSpy } = renderWithProviders(<StackBrowseModal />, {
    preloadedState,
  })

  const { players, playerOrder } = preloadedState.duel
  const player = players[playerOrder[0]]

  expect(getByText(player.cards[player.deck[0]].name)).toBeInTheDocument()

  fireEvent.click(getByText(closeMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(setIsBrowsingStack(false))
})

it("should be able to browse the player's discard", async () => {
  preloadedState.duel.isBrowsingStack = true
  preloadedState.duel.browsedStack = 'discard'

  const { getByText } = renderWithProviders(<StackBrowseModal />, {
    preloadedState,
  })

  const { players, playerOrder } = preloadedState.duel
  const player = players[playerOrder[0]]

  expect(getByText(player.cards[player.discard[0]].name)).toBeInTheDocument()
})
