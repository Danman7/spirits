import { PayloadAction } from '@reduxjs/toolkit'
import { PlayCard } from 'src/features/cards/types'

export interface Player {
  id: string
  name: string
  coins: number
  income: number
  deck: PlayCard['id'][]
  hand: PlayCard['id'][]
  board: PlayCard['id'][]
  discard: PlayCard['id'][]
  cards: { [index: PlayCard['id']]: PlayCard }
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
  attackingAgentId: PlayCard['id']
  hasAddedCardEffectListeners: boolean
}

interface PlayerCardPayload {
  cardId: PlayCard['id']
  playerId: Player['id']
}

export type PlayerCardAction = PayloadAction<PlayerCardPayload>
