import { GameState } from 'src/Game/types'

export interface Card {
  name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  description?: string
  flavor?: string
  onPlayAbility?: OnPlayAbilities
}

export interface Unit extends Card {
  strength: number
}

export interface PlayCard extends Card, Unit {
  id: string
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

export type CardAbilityFunction = (state: GameState) => GameState

export const enum OnPlayAbilities {
  ElevatedAcolyteOnPlay = 'ElevatedAcolyteOnPlay'
}

type EnumKeys = keyof typeof OnPlayAbilities

export type OnPlayAbilitiesMap = {
  [P in EnumKeys]: CardAbilityFunction
}
