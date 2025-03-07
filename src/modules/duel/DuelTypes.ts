import { CARD_STACKS } from 'src/modules/duel/constants'
import { Agent, Card } from 'src/shared/modules/cards/CardTypes'
import { User, Bot } from 'src/shared/modules/user/UserTypes'

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
  id: string
  $isOnTop?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface StackConfiguration {
  component: React.ComponentType<StackComponentProps>
  onClickStack?: React.MouseEventHandler<HTMLDivElement>
}

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
  | {
      type: 'START_DUEL'
      users: UsersStartingDuel
      firstPlayerIndex?: 0 | 1
    }
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
  | { type: 'DISCARD_CARD'; playerId: string; cardId: string }
  | UpdateAgentAction
  | { type: 'RESET_DUEL' }
  | { type: 'ADD_LOG'; message: React.ReactNode }

export type DuelPlayers = {
  [index: string]: Player
}

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

export interface DuelState {
  phase: DuelPhase
  attackingQueue: AttackOrder[]
  players: DuelPlayers
  playerOrder: [string, string]
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
