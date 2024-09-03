import { Reducer } from '@reduxjs/toolkit'

import store from 'src/shared/redux/store'
import { PlayCard } from 'src/Cards/CardTypes'

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export interface Player {
  id: string
  name: string
  coins: number
  deck: PlayCard[]
  hand: PlayCard[]
  board: PlayCard[]
  discard: PlayCard[]
  isActive: boolean
  hasPlayedCardThisTurn: boolean
  isCPU?: boolean
  isReady?: boolean
}

export const enum GamePhase {
  PRE_GAME = 'Pre-game',
  INITIAL_DRAW = 'Initial Draw',
  REDRAW = 'Redrawing Phase',
  PLAYER_TURN = 'Player Turn',
  RESOLVING_END_TURN = 'Resolving end of turn'
}

export interface GameState {
  turn: number
  phase: GamePhase
  players: PlayersInGame
  loggedInPlayerId: Player['id']
}

export type PlayerIndex = 0 | 1

export type PlayersInGame = [Player, Player]

export interface MainReducer {
  game: Reducer<GameState>
}

export interface MainState {
  game: GameState
}
