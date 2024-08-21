import { createListenerMiddleware } from '@reduxjs/toolkit'
import { GameActions } from '../Game/GameSlice'
import { AppDispatch, RootState } from '.'
import { checkForImplicitOnPlay } from '../Cards/CardUtils'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()

startAppListening({
  actionCreator: GameActions.playCard,
  effect: async ({ payload: playedCard }, { dispatch }) => {
    const { onPlay } = playedCard

    checkForImplicitOnPlay(playedCard, dispatch)

    if (onPlay) {
      dispatch(GameActions.triggerCardAbility(onPlay))
    }
  }
})
