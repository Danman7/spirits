import { Agent } from 'src/shared/modules/cards/CardTypes'
import { Bot, User } from 'src/shared/modules/user/UserTypes'

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
  | { type: 'ADD_LOG'; message: React.JSX.Element }
  | { type: 'AGENT_DAMAGE_SELF'; cardId: string; amount: number }
  | { type: 'TRIGGER_TARGET_SELECTION'; validTargets: string[] }
