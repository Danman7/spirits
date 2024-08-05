export interface Card {
  name: string
  cost: number
  factions: CardFaction[]
  types: CardType[]
  strength?: number
  description?: string
  flavor?: string
}

export interface PlayCard extends Card {
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
