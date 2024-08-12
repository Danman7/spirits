import { configureStore } from '@reduxjs/toolkit'
import type { AppDispatch, RootState, MainReducer } from './types'
import { useAppDispatch, useAppSelector } from './hooks'
import { reducer } from './reducer'

export const store = configureStore({
  reducer
})

export {
  AppDispatch,
  RootState,
  MainReducer as GameReducer,
  useAppDispatch,
  useAppSelector,
  reducer
}
