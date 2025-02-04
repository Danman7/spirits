import { CardBaseName } from 'src/shared/data'

export type CardRank = 'common' | 'unique'

export type CardType = 'agent' | 'instant' | 'location'

export type CardFaction = 'Order' | 'Chaos' | 'Shadow'

export type CardCategory =
  | 'Hammerite'
  | 'Undead'
  | 'Fence'
  | 'Pagan'
  | 'Thief'
  | 'Guard'
  | 'Necromancer'
  | 'Artifact'

export interface Traits {
  retaliates?: boolean
}

export type TraitName = keyof Traits

export interface CardBase {
  readonly name: string
  cost: number
  factions: CardFaction[]
  categories: CardCategory[]
  rank: CardRank
  strength: number
  type: CardType
  description?: string[]
  flavor?: string
  traits?: Traits
  counter?: number
}

export type AnimateState = 'in' | 'out' | ''

export interface AnimateStateProps {
  $animateState: AnimateState
}

export type CardStrengthAnimateState = 'boosted' | 'damaged' | ''

export interface User {
  id: string
  name: string
  deck: CardBaseName[]
}

export interface Bot extends User {
  isBot: true
}
