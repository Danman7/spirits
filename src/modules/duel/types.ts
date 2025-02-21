import { CARD_STACKS } from 'src/modules/duel'
import { Agent, Bot, Card, User } from 'src/shared/types'

export type CardStack = (typeof CARD_STACKS)[number]

export interface PlayerStacks {
  deck: string[]
  hand: string[]
  board: string[]
  discard: string[]
}

export type DuelCard = Card & {
  id: string
}

export type PlayerCards = { [index: string]: DuelCard }

export interface PlayerStacksAndCards extends PlayerStacks {
  cards: PlayerCards
}

export interface Player extends Omit<User, 'deck'>, PlayerStacksAndCards {
  coins: number
  income: number
  hasPerformedAction: boolean
  isBot?: boolean
}

export type DuelUser = User | Bot

interface StackComponentProps {
  children: React.ReactNode
  $isOnTop?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface StackConfiguration {
  component: React.ComponentType<StackComponentProps>
  onClickStack?: React.MouseEventHandler<HTMLDivElement>
}

export type DuelAction =
  | {
      type: 'START_DUEL'
      users: [DuelUser, DuelUser]
      firstPlayerId?: string
    }
  | { type: 'DRAW_INITIAL_CARDS' }
  | { type: 'PLAYER_READY'; playerId: string }
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
  | { type: 'PLAY_CARD'; playerId: string; cardId: string; shouldPay?: boolean }
  | { type: 'DISCARD_CARD'; playerId: string; cardId: string }
  | {
      type: 'UPDATE_AGENT'
      playerId: string
      cardId: string
      update: Partial<Agent>
    }

export type DuelPlayers = {
  [index: string]: Player
}

export interface AttackOrder {
  attackerId: string
  defenderId: string
  defendingPlayerId: string
}

export type DuelPhase =
  | 'Initial Draw'
  | 'Redrawing'
  | 'Player Turn'
  | 'Resolving turn'
  | 'Duel End'

export interface DuelState {
  phase: DuelPhase
  attackingQueue: AttackOrder[]
  players: DuelPlayers
  playerOrder: [string, string]
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
