import { fireEvent } from '@testing-library/dom'
import '@testing-library/jest-dom'
import { RootState } from 'src/app/store'
import { DuelModal } from 'src/modules/duel/components'
import {
  closeMessage,
  opponentFirst,
  playerFirst,
  victoryMessage,
} from 'src/modules/duel/messages'
import { setIsBrowsingStack } from 'src/modules/duel/slice'
import { opponentId, playerId, stackedStateMock } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

it('should show player names and if player is first on initializing a duel and then hide itself', () => {
  preloadedState.duel.phase = 'Initial Draw'
  const { getByText } = renderWithProviders(<DuelModal />, {
    preloadedState,
  })

  expect(
    getByText(
      `${preloadedState.duel.players[playerId].name} vs ${preloadedState.duel.players[opponentId].name}`,
    ),
  ).toBeInTheDocument()
  expect(getByText(playerFirst)).toBeInTheDocument()
})

it('should show that opponent is first if they win coin toss', () => {
  preloadedState.duel.phase = 'Initial Draw'
  preloadedState.duel.activePlayerId = opponentId

  const { getByText } = renderWithProviders(<DuelModal />, {
    preloadedState,
  })

  expect(getByText(opponentFirst)).toBeInTheDocument()
})

it("should show the duel victor's name", () => {
  preloadedState.duel.phase = 'Duel End'
  preloadedState.duel.victoriousPlayerId = opponentId
  const { getByText } = renderWithProviders(<DuelModal />, {
    preloadedState,
  })

  expect(
    getByText(
      `${preloadedState.duel.players[opponentId].name} ${victoryMessage}`,
    ),
  ).toBeInTheDocument()
})

it("should be able to browse the player's deck", () => {
  preloadedState.duel.isBrowsingStack = true

  const { getByText, dispatchSpy } = renderWithProviders(<DuelModal />, {
    preloadedState,
  })

  const { players, activePlayerId } = preloadedState.duel
  const player = players[activePlayerId]

  expect(getByText(player.cards[player.deck[0]].name)).toBeInTheDocument()

  fireEvent.click(getByText(closeMessage))

  expect(dispatchSpy).toHaveBeenCalledWith(setIsBrowsingStack(false))
})

it("should be able to browse the player's discard", async () => {
  preloadedState.duel.isBrowsingStack = true
  preloadedState.duel.browsedStack = 'discard'

  const { getByText } = renderWithProviders(<DuelModal />, {
    preloadedState,
  })

  const { players, activePlayerId } = preloadedState.duel
  const player = players[activePlayerId]

  expect(getByText(player.cards[player.discard[0]].name)).toBeInTheDocument()
})
