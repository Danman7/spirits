import { PlayCard } from '../types'

export const enum CardState {
  InDeck = 'In Deck',
  InHand = 'In Hand',
  OnBoard = 'On Board',
  InGraveyard = 'In Graveyard'
}

export interface CardProps {
  card: PlayCard
  isPlayable?: boolean
  isFaceDown?: boolean
  onClickCard?: (cardId: PlayCard['id']) => void
}

export interface CardPortalProps {
  card: PlayCard
  isPlayerCard?: boolean
}

export interface PositiveNegativeNumberProps {
  base: number
  current: number
}
