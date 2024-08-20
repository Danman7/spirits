import { PlayCard } from '../Cards/CardTypes'

export interface GameState extends StartGamePayload {
  turn: number
  activePlayerId: string
  isCardPlayedThisTurn: boolean
}

export interface Player {
  id: string
  name: string
  coins: number
  cards: PlayCard[]
  isNonHuman?: boolean
}

export interface StartGamePayload {
  topPlayer: Player
  bottomPlayer: Player
  isPlayerFirst?: boolean
}
