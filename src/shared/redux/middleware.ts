import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'

import { checkForImplicitOnPlay } from 'src/Cards/CardUtils'
import { GameActions } from 'src/Game/GameSlice'
import { AppDispatch, RootState } from 'src/shared/redux/StateTypes'

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

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
