import { CARD_STACKS } from 'src/modules/duel/duelConstants'
import { DuelPlayers } from 'src/modules/duel/playerTypes'
import { DuelAction } from 'src/modules/duel/state/duelActionTypes'
import { Card } from 'src/shared/modules/cards/CardTypes'

export interface AttackOrder {
  attackerId: string
  attackingPlayerId: string
  defenderId: string
  defendingPlayerId: string
}

export type DuelPhase =
  | 'Initial Draw'
  | 'Redrawing'
  | 'Player Turn'
  | 'Resolving turn'
  | 'Duel End'

type DuelCard = Card & {
  id: string
}

export type DuelCards = { [index: string]: DuelCard }

export interface DuelState {
  phase: DuelPhase
  attackingQueue: AttackOrder[]
  players: DuelPlayers
  playerOrder: [string, string]
  cards: DuelCards
  logs: React.ReactNode[]
}

export type DuelDispatch = (action: DuelAction) => void

export interface DuelTrigger {
  predicate: (state: DuelState, action: DuelAction) => boolean
  effect: ({
    state,
    action,
    dispatch,
  }: {
    state: DuelState
    action: DuelAction
    dispatch: DuelDispatch
  }) => void
}

export type CardStack = (typeof CARD_STACKS)[number]
