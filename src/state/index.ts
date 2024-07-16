import { configureStore } from '@reduxjs/toolkit'
import type { AppDispatch, RootState, MainReducer } from 'src/state/types'
import { useAppDispatch, useAppSelector } from 'src/state/hooks'
import { reducer } from 'src/state/reducer'

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
