import { PayloadAction } from '@reduxjs/toolkit'
import { DuelCard } from 'src/features/cards/types'

export type PlayerCards = { [index: DuelCard['id']]: DuelCard }

export type CardStack = 'deck' | 'hand' | 'board' | 'discard'

export interface PlayerStacks {
  deck: DuelCard['id'][]
  hand: DuelCard['id'][]
  board: DuelCard['id'][]
  discard: DuelCard['id'][]
  cards: PlayerCards
}

export interface Player extends PlayerStacks {
  id: string
  name: string
  coins: number
  income: number
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
export type DuelPlayers = {
  [index: Player['id']]: Player
}

export interface DuelState {
  turn: number
  phase: DuelPhase
  playerOrder: PlayerOrder
  players: DuelPlayers
  loggedInPlayerId: Player['id']
  activePlayerId: Player['id']
  attackingAgentId: DuelCard['id']
}

export type PlayerCardAction = PayloadAction<{
  cardId: DuelCard['id']
  playerId: Player['id']
}>

export type AddNewCardsAction = PayloadAction<{
  playerId: Player['id']
  cards: PlayerCards
}>
