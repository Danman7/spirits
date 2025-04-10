import { CARD_STACKS } from 'src/modules/duel/duel.constants'
import { DuelPlayers } from 'src/modules/duel/duel.types'

import type { Agent, Card } from 'src/shared/modules/cards'
import type { Bot, User } from 'src/shared/modules/user'

export interface AttackOrder {
  attackerId: string
  attackingPlayerId: string
  defenderId: string
  defendingPlayerId: string
}

export type DuelPhase =
  | 'Pre-duel'
  | 'Initial Draw'
  | 'Redrawing'
  | 'Player Turn'
  | 'Select Target'
  | 'Resolving turn'
  | 'Duel End'

type DuelCard = Card & { id: string }

export type DuelCards = { [index: string]: DuelCard }

export type PlayerOrder = [string, string]

export interface DuelState {
  phase: DuelPhase
  attackingQueue: AttackOrder[]
  players: DuelPlayers
  playerOrder: PlayerOrder
  cards: DuelCards
  logs: React.ReactNode[]
  targeting: {
    showTargetingModal: boolean
    triggererId: string
    validTargets: string[]
  }
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

export type DuelUser = User | Bot

export type UsersStartingDuel = [DuelUser, DuelUser]

export type PlayCardAction = {
  type: 'PLAY_CARD'
  playerId: string
  cardId: string
  shouldPay?: boolean
}

export type UpdateAgentAction = {
  type: 'UPDATE_AGENT'
  playerId: string
  cardId: string
  update: Partial<Agent>
}

export type DuelAction =
  | { type: 'START_DUEL'; users: UsersStartingDuel; firstPlayerIndex?: 0 | 1 }
  | { type: 'PROCEED_TO_DRAW' }
  | { type: 'DRAW_INITIAL_CARDS' }
  | { type: 'SKIP_REDRAW'; playerId: string }
  | { type: 'COMPLETE_REDRAW' }
  | { type: 'ADVANCE_TURN' }
  | { type: 'RESOLVE_TURN' }
  | {
      type: 'AGENT_ATTACK'
      defendingPlayerId: string
      defendingAgentId?: string
    }
  | { type: 'MOVE_TO_NEXT_ATTACKER' }
  | { type: 'REDRAW_CARD'; playerId: string; cardId: string }
  | PlayCardAction
  | { type: 'DISCARD_CARD'; cardId: string; shouldRecoverCost?: boolean }
  | { type: 'GAIN_COINS'; playerId: string; amount: number }
  | UpdateAgentAction
  | { type: 'ADD_LOG'; message: React.JSX.Element }
  | { type: 'AGENT_DAMAGE_SELF'; cardId: string; amount: number }
  | {
      type: 'TRIGGER_TARGET_SELECTION'
      validTargets: string[]
      triggererId: string
      showTargetingModal?: boolean
    }
  | { type: 'SELECT_TARGET'; cardId: string }
