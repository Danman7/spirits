import {
  ELEVATED_ACOLYTE_SELF_DAMAGE,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
} from 'src/shared/data/constants'
import { CardBase } from 'src/shared/types'

export const YoraSkull: CardBase = {
  type: 'instant',
  name: "Saint Yora's Skull",
  cost: 5,
  strength: 0,
  rank: 'unique',
  factions: ['Order'],
  categories: ['Artifact'],
  description: [
    'Boost every Hammerite on the board by 1. If staring deck contains only Order cards boost all Hammerites in hand also.',
  ],
  flavor: 'Yora was a builder of vision and devout keeper of the faith.',
}

export const HouseGuard: CardBase = {
  type: 'agent',
  name: 'House Guard',
  strength: 2,
  cost: 2,
  rank: 'common',
  factions: ['Order'],
  categories: ['Guard'],
  description: ['On defeat, play a copy of this card from your hand or deck.'],
  flavor:
    'The Sir will be taking his dinner and evening out tonight. The house guard is not to find this an opportunity to shirk, and lapses will be brought up with the Sir.',
}

export const HammeriteNovice: CardBase = {
  type: 'agent',
  name: 'Hammerite Novice',
  strength: 2,
  cost: 3,
  rank: 'common',
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    'On play if you have another Hammerite in play also play all other copies of this card from your hand or deck for free.',
  ],
  flavor:
    'This novice has been instructed in the rules and strictures of the Order and has sworn his warrants to be silent in his vigils.',
}

export const ElevatedAcolyte: CardBase = {
  type: 'agent',
  name: 'Elevated Acolyte',
  strength: 3,
  cost: 2,
  rank: 'common',
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    `On play, damage self by ${ELEVATED_ACOLYTE_SELF_DAMAGE} if is not played next to a Hammerite with higher strength.`,
  ],
  flavor:
    'He will endure a standard three-year contract of service, at the end of which he will be considered for indoctrination as an Elevated Acolyte.',
}

export const TempleGuard: CardBase = {
  type: 'agent',
  name: 'Temple Guard',
  strength: 5,
  cost: 5,
  rank: 'common',
  factions: ['Order'],
  categories: ['Hammerite', 'Guard'],
  traits: {
    retaliates: true,
  },
  flavor:
    'Thy hammer pounds the nail, holds the roof-beam. Thy hammer strikes the iron, shapes the cauldron.',
}

export const BrotherSachelman: CardBase = {
  type: 'agent',
  name: 'Brother Sachelman',
  strength: 4,
  cost: 6,
  rank: 'unique',
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    `On play boost all allied Hammerites on board that have lower strength than this card's strength by ${HAMMERITES_WITH_LOWER_STRENGTH_BOOST}`,
  ],
  flavor:
    'May the Hammer fall on the unrighteous. Officially, Brother Sachelman',
}

export const HighPriestMarkander: CardBase = {
  type: 'agent',
  name: 'High Priest Markander',
  strength: 4,
  cost: 8,
  rank: 'unique',
  factions: ['Order'],
  categories: ['Hammerite'],
  description: [
    `Once 10 Hammerite cards have been played, play High Priest Markander from your hand or deck.`,
  ],
  flavor:
    "He is old, and the Master Forgers do jostle each other for precedence. But I spy not on my betters. 'Tis in The Builder's Hands.",
}
