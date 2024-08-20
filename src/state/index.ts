import { configureStore } from '@reduxjs/toolkit'
import type { AppDispatch, RootState, MainReducer } from './StateTypes'
import { useAppDispatch, useAppSelector } from './hooks'
import { reducer } from './reducer'
import { listenerMiddleware } from './middleware'

export const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})

export {
  AppDispatch,
  RootState,
  MainReducer as GameReducer,
  useAppDispatch,
  useAppSelector,
  reducer
}
