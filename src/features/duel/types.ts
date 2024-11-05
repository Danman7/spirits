import { PayloadAction } from '@reduxjs/toolkit'
import { DuelCard } from 'src/features/cards/types'

export interface Player {
  id: string
  name: string
  coins: number
  income: number
  deck: DuelCard['id'][]
  hand: DuelCard['id'][]
  board: DuelCard['id'][]
  discard: DuelCard['id'][]
  cards: { [index: DuelCard['id']]: DuelCard }
  hasPerformedAction: boolean
  isCPU?: boolean
}

export type DuelPhase =
  | 'Pre-duel'
  | 'Initial Draw'
  | 'Redrawing Phase'
  | 'Player Turn'
  | 'Resolving end of turn'

export type PlayerOrder = [Player['id'], Player['id']]

export interface DuelState {
  turn: number
  phase: DuelPhase
  playerOrder: PlayerOrder
  players: {
    [index: Player['id']]: Player
  }
  loggedInPlayerId: Player['id']
  activePlayerId: Player['id']
  attackingAgentId: DuelCard['id']
  hasAddedCardEffectListeners: boolean
}

interface PlayerCardPayload {
  cardId: DuelCard['id']
  playerId: Player['id']
}

export type PlayerCardAction = PayloadAction<PlayerCardPayload>
