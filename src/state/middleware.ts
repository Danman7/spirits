import { createListenerMiddleware } from '@reduxjs/toolkit'
import { GameActions } from '../Game/GameSlice'
import { AppDispatch, RootState } from '.'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()

startAppListening({
  actionCreator: GameActions.playCard,
  effect: async (action, { dispatch }) => {
    const { onPlay } = action.payload

    if (onPlay) {
      dispatch(GameActions.triggerOnPlayAbility(onPlay))
    }
  }
})
