import { Reducer } from '@reduxjs/toolkit'

import { GameState } from 'src/Game/GameTypes'
import store from 'src/shared/redux/store'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface MainReducer {
  game: Reducer<GameState>
}

export interface MainState {
  game: GameState
}
