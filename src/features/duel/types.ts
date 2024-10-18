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

export interface DuelState {
  turn: number
  phase: DuelPhase
  playerOrder: Player['id'][]
  players: {
    [index: Player['id']]: Player
  }
  loggedInPlayerId: Player['id']
  activePlayerId: Player['id']
  attackingAgentId: PlayCard['id']
}

interface PlayerCardPayload {
  cardId: PlayCard['id']
  playerId: Player['id']
}

export type PlayerCardAction = PayloadAction<PlayerCardPayload>

interface AgentAttackPayload {
  attackingCardId: PlayCard['id']
  attackinPlayerId: Player['id']
  defendingPlayerId: Player['id']
}

export type AgentAttacksPlayerAction = PayloadAction<AgentAttackPayload>

interface AgentAttacksAgentPayload extends AgentAttackPayload {
  defendingCardId: PlayCard['id']
}

export type AgentAttacksAgentAction = PayloadAction<AgentAttacksAgentPayload>
