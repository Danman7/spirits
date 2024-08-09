import { GameState } from 'src/Game/types'

export interface Card {
  name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  strength?: number
  description?: string
  flavor?: string
  onPlayAbility?: OnPlayAbilities
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
  Thief = 'Thief'
}

export type CardAbilityFunction = (state: GameState) => void

export const enum OnPlayAbilities {
  ElevatedAcolyteOnPlay = 'ElevatedAcolyteOnPlay'
}

type EnumKeys = keyof typeof OnPlayAbilities

export type OnPlayAbilitiesMap = {
  [P in EnumKeys]: CardAbilityFunction
}
