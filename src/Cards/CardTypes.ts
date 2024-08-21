import { CardState, GameState } from '../Game/GameTypes'
import * as CardAbilities from '../Cards/CardAbilities'

export type CardAbility = keyof typeof CardAbilities

export interface Card {
  name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  strength?: number
  description?: string
  flavor?: string
  onPlay?: CardAbility
}

export interface PlayCard extends Card {
  id: string
  strength?: number
  prototype: {
    strength?: Card['strength']
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
  Guard = 'Guard'
}

export type CardAbilityFunction = (state: GameState) => void

export interface CardProps {
  card: PlayCard
  isOnBoard?: boolean
  isPlayable?: boolean
  isFaceDown?: boolean
  onClickCard?: (cardId: PlayCard) => void
}

export interface CardPortalProps {
  card: PlayCard
  cardState?: CardState
  isPlayerCard?: boolean
}

export interface PositiveNegativeNumberProps {
  base: number
  current: number
}
