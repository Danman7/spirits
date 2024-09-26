import { PayloadAction } from '@reduxjs/toolkit'
import { PlayCard } from 'src/features/cards/types'

export interface Player {
  id: string
  name: string
  coins: number
  deck: PlayCard['id'][]
  hand: PlayCard['id'][]
  board: PlayCard['id'][]
  discard: PlayCard['id'][]
  cards: { [index: PlayCard['id']]: PlayCard }
  isActive: boolean
  hasPlayedCardThisTurn: boolean
  isCPU?: boolean
  isReady?: boolean
}

export const enum DuelPhase {
  PRE_DUEL = 'Pre-duel',
  INITIAL_DRAW = 'Initial Draw',
  REDRAW = 'Redrawing Phase',
  PLAYER_TURN = 'Player Turn',
  RESOLVING_END_TURN = 'Resolving end of turn',
}

export interface DuelState {
  turn: number
  phase: DuelPhase
  playerOrder: Player['id'][]
  players: {
    [index: Player['id']]: Player
  }
  loggedInPlayerId: Player['id']
}

export type PlayCardFromHandAction = PayloadAction<{
  card: PlayCard
  playerId: Player['id']
}>
