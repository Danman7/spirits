import { PayloadAction } from '@reduxjs/toolkit'
import { CARD_STACKS } from 'src/modules/duel'
import { CardBaseName } from 'src/shared/data'
import { Bot, CardBase, User } from 'src/shared/types'

export type CardStack = (typeof CARD_STACKS)[number]

export interface PlayerStacks {
  deck: string[]
  hand: string[]
  board: string[]
  discard: string[]
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

export type DuelPhase =
  | 'Initial Draw'
  | 'Redrawing'
  | 'Player Turn'
  | 'Resolving turn'
  | 'Duel End'

export type DuelPlayers = {
  [index: string]: Player
}

export interface AttackOrder {
  attackerId: string
  defenderId: string
}

export interface DuelState {
  phase: DuelPhase
  activePlayerId: string
  inactivePlayerId: string
  attackingAgentId: string
  victoriousPlayerId: string
  browsedStack: CardStack
  isBrowsingStack: boolean
  attackingQueue: AttackOrder[]
  players: DuelPlayers
}

export type PlayerAction = PayloadAction<{ playerId: string }>

interface PlayerCardActionPayload {
  cardId: string
  playerId: string
}

export type PlayerCardAction = PayloadAction<PlayerCardActionPayload>

export type PlayCardAction = PayloadAction<
  PlayerCardActionPayload & {
    shouldPay: boolean
  }
>

export type AddNewCardsAction = PayloadAction<{
  playerId: string
  cards: PlayerCards
}>

/**
 *  A ready for duel card object with unique id and base properties for reference.
 */
export type DuelCard = CardBase & {
  id: string
  baseName: CardBaseName
}

export type DuelUser = User | Bot

export type DuelStartUsers = [DuelUser, DuelUser]

interface StackComponentProps {
  'data-testid': string
  children: React.ReactNode
  isOnTop?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export interface StackConfiguration {
  component: React.ComponentType<StackComponentProps>
  testId: string
  onClickStack?: React.MouseEventHandler<HTMLDivElement>
}
