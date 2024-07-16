import { PlayCard } from '../Cards/types'

export interface GameState extends StartGamePayload {
  turn: number
  activePlayerId: string
}

export interface Player {
  id: string
  name: string
  deck: PlayCard[]
  field: PlayCard[]
}

export interface StartGamePayload {
  topPlayer: Player
  bottomPlayer: Player
}
