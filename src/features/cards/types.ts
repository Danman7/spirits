import { HTMLMotionProps } from 'framer-motion'

export interface Card {
  readonly name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  strength: number
  description?: string
  flavor?: string
}

export interface PlayCard extends Card {
  id: string
  prototype: {
    strength: Card['strength']
    cost: Card['cost']
  }
}

export const enum CardFaction {
  Order = 'Order',
  Chaos = 'Chaos',
  Shadow = 'Shadow'
}

export const enum CardType {
  Hammerite = 'Hammerite',
  Undead = 'Undead',
  Fence = 'Fence',
  Pagan = 'Pagan',
  Thief = 'Thief',
  Guard = 'Guard',
  Necromancer = 'Necromancer',
  Artifact = 'Artifact'
}

export interface CardProps extends HTMLMotionProps<'div'> {
  card: PlayCard
  onClickCard?: (card: PlayCard) => void
}
