import { PlayCard } from '../types'

export const enum CardState {
  InDeck = 'In Deck',
  InHand = 'In Hand',
  OnBoard = 'On Board',
  InGraveyard = 'In Graveyard'
}

export interface CardProps {
  card: PlayCard
  isPlayerCard?: boolean
  isPlayable?: boolean
  isFaceDown?: boolean
  onClick?: (cardId: PlayCard['id']) => void
}

export interface PositiveNegativeNumberProps {
  base: number
  current: number
}
