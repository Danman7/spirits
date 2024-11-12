import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'

import { AppDispatch, RootState } from 'src/app/store'

export const listenerMiddleware = createListenerMiddleware()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()
