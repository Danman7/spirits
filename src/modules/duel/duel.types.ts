import type { User } from 'src/shared/modules/user'

export interface PlayerStacks {
  deck: string[]
  hand: string[]
  board: string[]
  discard: string[]
}

export interface Player extends Omit<User, 'deck'>, PlayerStacks {
  coins: number
  income: number
  hasPerformedAction: boolean
  isBot?: boolean
}

export type DuelPlayers = { [index: string]: Player }
