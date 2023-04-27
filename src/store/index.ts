import { configureStore } from '@reduxjs/toolkit'
import { RegionsRducer } from 'src/regions'
import type { AppDispatch, RootState } from 'src/store/types.d'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'

export const store = configureStore({
  reducer: {
    regions: RegionsRducer
  }
})

export { AppDispatch, RootState, useAppDispatch, useAppSelector }
