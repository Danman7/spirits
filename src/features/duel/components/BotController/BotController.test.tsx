import { RootState } from 'src/app/store'
import { BotController } from 'src/features/duel/components'
import { completeRedraw, playCard, resolveTurn } from 'src/features/duel/slice'
import { opponentId as playerId, stackedStateMock } from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone } from 'src/shared/utils'

let preloadedState: RootState

beforeEach(() => {
  preloadedState = deepClone(stackedStateMock)
})

it('should skip redrawing', () => {
  preloadedState.duel.phase = 'Redrawing'

  const { dispatchSpy } = renderWithProviders(
    <BotController playerId={playerId} />,
    {
      preloadedState,
    },
  )

  expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw(playerId))
})

it('should play a card within budget on turn', () => {
  preloadedState.duel.activePlayerId = playerId
  preloadedState.duel.players[playerId].coins = 3

  const { dispatchSpy } = renderWithProviders(
    <BotController playerId={playerId} />,
    {
      preloadedState,
    },
  )

  const cardId = preloadedState.duel.players[playerId].hand[0]

  expect(dispatchSpy).toHaveBeenCalledWith(
    playCard({
      cardId,
      playerId,
    }),
  )
  expect(dispatchSpy).toHaveBeenCalledWith(resolveTurn())
})

it('should play no card if there is no budget', () => {
  preloadedState.duel.activePlayerId = playerId
  preloadedState.duel.players[playerId].coins = 0

  const { dispatchSpy } = renderWithProviders(
    <BotController playerId={playerId} />,
    {
      preloadedState,
    },
  )

  expect(dispatchSpy).toHaveBeenCalledTimes(1)
  expect(dispatchSpy).toHaveBeenCalledWith(resolveTurn())
})
