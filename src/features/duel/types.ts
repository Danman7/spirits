import { PayloadAction } from '@reduxjs/toolkit'
import { CardBase } from 'src/features/cards/types'

export type PlayerCards = { [index: string]: DuelCard }

export type CardStack = 'deck' | 'hand' | 'board' | 'discard'

export interface PlayerStacks {
  deck: string[]
  hand: string[]
  board: string[]
  discard: string[]
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

export type DuelPlayers = {
  [index: string]: Player
}

export interface DuelState {
  phase: DuelPhase
  players: DuelPlayers
  loggedInPlayerId: string
  activePlayerId: string
  attackingAgentId: string
}

export type PlayerCardAction = PayloadAction<{
  cardId: string
  playerId: string
}>

export type AddNewCardsAction = PayloadAction<{
  playerId: string
  cards: PlayerCards
}>

/**
 *  A ready for duel card object with unique id and base properties for reference.
 */
export interface DuelCard extends CardBase {
  id: string
  strength: number
  base: {
    cost: number
    strength: number
  }
}
