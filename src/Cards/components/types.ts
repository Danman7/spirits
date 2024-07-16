import { PlayCard } from '../types'

export interface CardProps {
  card: PlayCard
  isFaceDown?: boolean
  onClick?: (cardId: PlayCard['id']) => void
}
