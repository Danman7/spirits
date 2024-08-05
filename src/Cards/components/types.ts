import { PlayCard } from '../types'

export interface CardProps {
  card: PlayCard
  isActive?: boolean
  isFaceDown?: boolean
  onClick?: (cardId: PlayCard['id']) => void
}
