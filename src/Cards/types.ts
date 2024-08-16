import { GameState } from '../Game/types'
import { CardState } from './components/types'

export interface Card {
  name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  strength?: number
  description?: string
  flavor?: string
  onPlayAbility?: OnPlayAbility
}

export interface PlayCard extends Card {
  id: string
  strength?: number
  prototype: {
    strength?: Card['strength']
    cost: Card['cost']
  }
  state: CardState
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

export const enum OnPlayAbility {
  BrotherSachelmanOnPlay = 'BrotherSachelmanOnPlay',
  HammeriteNoviceOnPlay = 'HammeriteNoviceOnPlay'
}

type EnumKeys = keyof typeof OnPlayAbility

export type OnPlayAbilitiesMap = {
  [P in EnumKeys]: CardAbilityFunction
}
