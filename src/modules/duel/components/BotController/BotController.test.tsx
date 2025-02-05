import { act } from 'react'
import { RootState } from 'src/app'
import { BotController } from 'src/modules/duel/components'
import { completeRedraw, playCard, resolveTurn } from 'src/modules/duel'
import {
  opponentId,
  opponentId as playerId,
  stackedStateMock,
} from 'src/shared/__mocks__'
import { renderWithProviders } from 'src/shared/rtlRender'
import { deepClone } from 'src/shared/utils'

jest.useFakeTimers()

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

  expect(dispatchSpy).toHaveBeenCalledWith(completeRedraw({ playerId }))
})

it('should play a card within budget on turn', () => {
  preloadedState.duel.playerOrder = [playerId, opponentId]
  preloadedState.duel.players[playerId].coins = 3

  const { dispatchSpy } = renderWithProviders(
    <BotController playerId={playerId} />,
    {
      preloadedState,
    },
  )

  const cardId = preloadedState.duel.players[playerId].hand[0]

  act(() => {
    jest.runAllTimers()
  })

  expect(dispatchSpy).toHaveBeenCalledWith(
    playCard({
      cardId,
      playerId,
      shouldPay: true,
    }),
  )
})

it('should play no card if there is no budget', () => {
  preloadedState.duel.playerOrder = [playerId, opponentId]
  preloadedState.duel.players[playerId].coins = 0

  const { dispatchSpy } = renderWithProviders(
    <BotController playerId={playerId} />,
    {
      preloadedState,
    },
  )

  act(() => {
    jest.runAllTimers()
  })

  expect(dispatchSpy).toHaveBeenCalledTimes(1)
  expect(dispatchSpy).toHaveBeenCalledWith(resolveTurn())
})
