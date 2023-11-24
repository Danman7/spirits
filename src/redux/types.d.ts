import { Reducer } from '@reduxjs/toolkit'
import { store } from 'src/redux'
import { RegionsState } from 'src/world/RegionsSlice'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface GameReducer {
  regions: Reducer<RegionsState>
}
