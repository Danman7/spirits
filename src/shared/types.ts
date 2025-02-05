import { CardBaseName } from 'src/shared/data'

export type CardRank = 'common' | 'unique'

export type CardType = 'agent' | 'instant'

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

export interface AgentTraits {
  retaliates?: boolean
}

export type AgentTraitName = keyof AgentTraits

interface CardBase {
  readonly name: string
  cost: number
  factions: CardFaction[]
  categories: CardCategory[]
  rank: CardRank
  type: CardType
  description: string[]
  flavor: string
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
