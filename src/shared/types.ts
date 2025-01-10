import {
  CardEffectName,
  CardEffectPredicateName,
} from 'src/features/cards/types'

/**
 * A card’s rank controls how many copies of a card one can have in a deck. Sometimes it also directs card effects.
 */
type CardRank = 'common' | 'unique'

/**
 * A card’s type decides how it is played and removed from the board.
 */
type CardType = 'agent' | 'instant' | 'location'

/**
 * A card may belong to one or multiple factions. This plays a role in deck building determining which cards can go together. A card may also belong to no faction, being neutral, and can be mixed with cards from any faction.
 */
export type CardFaction = 'Order' | 'Chaos' | 'Shadow'

/**
 * A card can have one or multiple categories which are considered for card effects.
 */
export type CardCategory =
  | 'Hammerite'
  | 'Undead'
  | 'Fence'
  | 'Pagan'
  | 'Thief'
  | 'Guard'
  | 'Necromancer'
  | 'Artifact'

/**
 * Represents a base card object which is used to create instances of this card.
 */
export interface CardBase {
  readonly name: string
  cost: number
  strength?: number
  factions: CardFaction[]
  categories: CardCategory[]
  type: CardType
  rank: CardRank
  description: string[]
  flavor?: string
  trigger?: {
    predicate: CardEffectPredicateName
    effect: CardEffectName
  }
}

export interface User {
  id: string
  name: string
  deck: CardBase[]
}

export interface Bot extends User {
  isBot: true
}
