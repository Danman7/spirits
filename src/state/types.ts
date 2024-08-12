import { Reducer } from '@reduxjs/toolkit'
import { GameState } from '../Game/types'
import { store } from '../state'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface MainReducer {
  game: Reducer<GameState>
}

export interface MainState {
  game: GameState
}
