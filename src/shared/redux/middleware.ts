import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/shared/redux/StateTypes'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
