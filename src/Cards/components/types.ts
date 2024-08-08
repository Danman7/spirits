import { PlayCard } from '../types'

export interface CardProps {
  card: PlayCard
  isOnTheBoard?: boolean
  isPlayable?: boolean
  isFaceDown?: boolean
  onClick?: (cardId: PlayCard['id']) => void
}

export interface PositiveNegativeNumberProps {
  base: number
  current: number
}
