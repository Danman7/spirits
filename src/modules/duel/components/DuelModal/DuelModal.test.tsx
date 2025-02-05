import { RootState } from 'src/app'
import { DuelModal } from 'src/modules/duel/components'
import { opponentFirst, playerFirst, victoryMessage } from 'src/modules/duel'
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
  preloadedState.duel.playerOrder = [opponentId, playerId]

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
