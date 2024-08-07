import { PlayCard } from '../types'

export interface CardProps {
  card: PlayCard
  isPlayable?: boolean
  isFaceDown?: boolean
  onClick?: (cardId: PlayCard['id']) => void
}

export interface PositiveNegativeNumberProps {
  base: number
  current: number
}
