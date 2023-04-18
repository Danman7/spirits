import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'

import { regionsRducer } from '../regions/RegionsSlice'

export const store = configureStore({
  reducer: {
    regions: regionsRducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch: () => AppDispatch = useDispatch
