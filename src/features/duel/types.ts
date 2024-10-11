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
  hasPlayedCardThisTurn: boolean
  isCPU?: boolean
  isReady?: boolean
}

export type DuelPhase =
  | 'Pre-duel'
  | 'Initial Draw'
  | 'Redrawing Phase'
  | 'Player Turn'
  | 'Resolving end of turn'

export interface DuelState {
  turn: number
  phase: DuelPhase
  playerOrder: Player['id'][]
  players: {
    [index: Player['id']]: Player
  }
  loggedInPlayerId: Player['id']
  activePlayerId: Player['id']
  attackingAgentId: PlayCard['id']
}

export type PlayCardFromHandAction = PayloadAction<{
  cardId: PlayCard['id']
  playerId: Player['id']
}>
