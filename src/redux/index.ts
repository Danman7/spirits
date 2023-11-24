import { configureStore } from '@reduxjs/toolkit'
import type { AppDispatch, RootState } from 'src/redux/types'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { reducer } from 'src/redux/reducer'
import { GameReducer } from 'src/redux/types.d'

export const store = configureStore({
  reducer
})

export {
  AppDispatch,
  RootState,
  GameReducer,
  useAppDispatch,
  useAppSelector,
  reducer
}
