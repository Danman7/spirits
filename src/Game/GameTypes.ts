import { PlayCard } from 'src/Cards/CardTypes'

export interface GameState extends StartGamePayload {
  turn: number
  activePlayerId: string
  isCardPlayedThisTurn: boolean
}

export interface Player {
  id: string
  name: string
  coins: number
  deck: PlayCard[]
  hand: PlayCard[]
  board: PlayCard[]
  discard: PlayCard[]
  isNonHuman?: boolean
}

export interface StartGamePayload {
  topPlayer: Player
  bottomPlayer: Player
  isPlayerFirst?: boolean
}

export const enum CardState {
  InDeck = 'In Deck',
  InHand = 'In Hand',
  OnBoard = 'On Board',
  InDiscard = 'In Discard'
}
