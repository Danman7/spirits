import {
  ELEVATED_ACOLYTE_SELF_DAMAGE,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HIGH_PRIEST_MAKANDER_COUNTER,
  TEMPLE_GUARD_BOOST,
} from 'src/shared/modules/cards/CardConstants'
import {
  Agent,
  AgentWithCounter,
  Instant,
} from 'src/shared/modules/cards/CardTypes'

export const YoraSkull: Instant = {
  type: 'instant',
  name: "Saint Yora's Skull",
  cost: 5,
  isUnique: true,
  factions: ['Order'],
  categories: ['Artifact'],
  description: [
    'Boost every Hammerite on the board by 1. If staring deck contains only Order cards boost all Hammerites in hand also.',
  ],
  flavor: 'Yora was a builder of vision and devout keeper of the faith.',
}

export const HouseGuard: Agent = {
  type: 'agent',
  name: 'House Guard',
  strength: 2,
  cost: 2,
  factions: ['Order'],
  categories: ['Guard'],
  description: ['On defeat, play a copy of this card from your hand or deck.'],
  flavor:
    'The Sir will be taking his dinner and evening out tonight. The house guard is not to find this an opportunity to shirk, and lapses will be brought up with the Sir.',
}

export const HammeriteNovice: Agent = {
  type: 'agent',
  name: 'Hammerite Novice',
  strength: 2,
  cost: 2,
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    'On play, if another Hammerite is on your board, play all other copies of this card from your hand or deck for free.',
  ],
  flavor:
    'This novice has been instructed in the rules and strictures of the Order and has sworn his warrants to be silent in his vigils.',
}

export const ElevatedAcolyte: Agent = {
  type: 'agent',
  name: 'Elevated Acolyte',
  strength: 3,
  cost: 2,
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    `On play, take ${ELEVATED_ACOLYTE_SELF_DAMAGE} damage unless played next to a stronger Hammerite.`,
  ],
  flavor:
    'He will endure a standard three-year contract of service, at the end of which he will be considered for indoctrination as an Elevated Acolyte.',
}

export const TempleGuard: Agent = {
  type: 'agent',
  name: 'Temple Guard',
  strength: 4,
  cost: 5,
  factions: ['Order'],
  categories: ['Hammerite', 'Guard'],
  description: [
    `On play, boost self by ${TEMPLE_GUARD_BOOST} if your opponent has more cards on board.`,
  ],
  traits: {
    retaliates: true,
  },
  flavor:
    'Thy hammer pounds the nail, holds the roof-beam. Thy hammer strikes the iron, shapes the cauldron.',
}

export const BrotherSachelman: Agent = {
  type: 'agent',
  name: 'Brother Sachelman',
  strength: 4,
  cost: 6,
  isUnique: true,
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    `On play boost all allied Hammerites on board with lower strength than this card's strength by ${HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
  ],
  flavor:
    'May the Hammer fall on the unrighteous. Officially, Brother Sachelman',
}

export const HighPriestMarkander: AgentWithCounter = {
  type: 'agent',
  name: 'High Priest Markander',
  strength: 4,
  cost: 5,
  counter: HIGH_PRIEST_MAKANDER_COUNTER,
  isUnique: true,
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    'Starts with 10 counters. When a Hammerite is played, lose 1 counter. At 0 counters, if in hand or deck, play for free.',
  ],
  flavor:
    "He is old, and the Master Forgers do jostle each other for precedence. But I spy not on my betters. 'Tis in The Builder's Hands.",
}

export const HammeritePriest: Agent = {
  type: 'agent',
  name: 'Hammerite Priest',
  strength: 3,
  cost: 6,
  isUnique: true,
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    'On play, choose a card from your board to discard and immediately recover its cost.',
  ],
  flavor:
    'The harlot did say to the priest "Tarry a while, and wait upon thy duties" and the priest did tarry. And was the priest crushed beneath the great gears, for the path of righteousness leads ever upwards, to where it is perilous to fall.',
}
