import { PayloadAction } from '@reduxjs/toolkit'
import { UserCards, User } from 'src/shared/types'

export type CardStack = 'deck' | 'hand' | 'board' | 'discard'

export interface PlayerStacks {
  deck: string[]
  hand: string[]
  board: string[]
  discard: string[]
}

export interface PlayerStacksAndCards extends PlayerStacks {
  cards: UserCards
}

export interface Player extends User, PlayerStacks {
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

export type DuelPlayers = {
  [index: string]: Player
}

export interface DuelState {
  phase: DuelPhase
  players: DuelPlayers
  activePlayerId: string
  attackingAgentId: string
}

export type PlayerCardAction = PayloadAction<{
  cardId: string
  playerId: string
}>

export type AddNewCardsAction = PayloadAction<{
  playerId: string
  cards: UserCards
}>
