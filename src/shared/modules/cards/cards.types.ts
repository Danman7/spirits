import { CardBases } from 'src/shared/modules/cards'

type CardType = 'agent' | 'instant'

type CardCategory =
  | 'Hammerite'
  | 'Undead'
  | 'Fence'
  | 'Pagan'
  | 'Thief'
  | 'Guard'
  | 'Necromancer'
  | 'Artifact'

interface AgentTraits {
  retaliates?: boolean
}

export type AgentTraitName = keyof AgentTraits

export type CardFaction = 'Order' | 'Chaos' | 'Shadow'

interface CardBase {
  readonly name: string
  cost: number
  factions: CardFaction[]
  categories: CardCategory[]
  type: CardType
  description: string[]
  flavor: string
  isElite?: boolean
}

export interface Instant extends CardBase {
  type: 'instant'
}

export interface Agent extends CardBase {
  type: 'agent'
  strength: number
  traits?: AgentTraits
  counter?: number
}

export interface AgentWithCounter extends Agent {
  counter: number
}

export type Card = Instant | Agent | AgentWithCounter

export type CardStrengthAnimateState = 'boosted' | 'damaged' | ''

export type CardBaseKey = keyof typeof CardBases
