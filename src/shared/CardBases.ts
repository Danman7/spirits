import {
  AZARAN_BOOST,
  DOWNWINDER_BOOST,
  ELEVATED_ACOLYTE_SELF_DAMAGE,
  GARRETT_COIN_GAIN,
  HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
  HAUNT_DAMAGE,
  VIKTORIA_COIN_GAIN,
} from 'src/shared/constants'
import { CardBase } from 'src/shared/types'
import { getCoinsMessage } from 'src/shared/utils'

export const Zombie: CardBase = {
  type: 'agent',
  name: 'Zombie',
  strength: 3,
  cost: 1,
  rank: 'common',
  factions: ['Chaos'],
  categories: ['Undead'],
  description: [
    'If this card is in your discard pile when a Necromancer is played, bring it back to your board.',
  ],
  flavor:
    "The zombie's antipathy for all living creatures is both its strength and weakness.",
}

export const Haunt: CardBase = {
  type: 'agent',
  name: 'Haunt',
  strength: 7,
  cost: 3,
  rank: 'common',
  factions: ['Chaos'],
  categories: ['Undead', 'Hammerite'],
  description: [
    `Whenever your opponent plays a card with strength, damage it by ${HAUNT_DAMAGE}.`,
  ],
  flavor:
    'These haunts who inhabit the bodies of my brethren... they must all be killed. -- The apparition of Brother Murus',
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
    'On play if you have another Hammerite in play also play all other copies of this card from your hand or deck.',
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
  description: ['When this card is attacked, it retaliates.'],
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

export const ViktoriaThiefPawn: CardBase = {
  type: 'agent',
  name: 'Viktoria: Thiefs-pawn',
  strength: 4,
  cost: 5,
  rank: 'unique',
  factions: ['Chaos', 'Shadow'],
  categories: ['Fence', 'Pagan'],
  description: [
    `Whenever you steal coins from the opponent, gain ${getCoinsMessage(
      VIKTORIA_COIN_GAIN,
    )}.`,
  ],
  flavor:
    'About your Victoria, nothing yet. Walks she an inch above the ground, for all the dirt of her footprints have I found. -- From a report to Lord Bafford',
}

export const GarrettMasterThief: CardBase = {
  type: 'agent',
  name: 'Garrett: Master Thief',
  strength: 4,
  cost: 5,
  rank: 'unique',
  factions: ['Shadow'],
  categories: ['Thief'],
  description: [
    `Whenever your opponent spends coins, gain ${getCoinsMessage(
      GARRETT_COIN_GAIN,
    )}.`,
  ],
  flavor:
    'His heart was clouded, and his balance was lost, but his abilities were unmatched. -- Keeper Annals',
}

export const DownwinderThief: CardBase = {
  type: 'agent',
  name: 'Downwinder Thief',
  strength: 2,
  cost: 1,
  rank: 'common',
  factions: ['Shadow'],
  categories: ['Thief'],
  description: [
    `When stealing coins from opponent boost self by ${DOWNWINDER_BOOST}.`,
  ],
  flavor:
    "We chose our profession in defiance of the greed of the monarchy. We will not live for the sake of taxes to fatten the noble's pockets. -- excerpt from the Downwinders Creed",
}

export const AzaranTheCruel: CardBase = {
  type: 'agent',
  name: 'Azaran the Cruel',
  strength: 5,
  cost: 5,
  rank: 'unique',
  factions: ['Chaos'],
  categories: ['Necromancer'],
  description: [
    `On play boost self by ${AZARAN_BOOST} for each Undead card in the discard pile.`,
  ],
  flavor:
    "Be warned! The truth is hidden from the unworthy. Blacken thy heart, or face the prisoners of flesh. -- Azaran's last mortal written words",
}

export const BookOfAsh: CardBase = {
  type: 'instant',
  name: 'The Book of Ash',
  strength: 0,
  cost: 5,
  rank: 'unique',
  factions: ['Chaos'],
  categories: ['Artifact'],
  description: [
    'Summon 2 copies of the top non-unique agent in your discard pile.',
  ],
  flavor:
    'I owe my transcendence to the Book of Ash, that tome of legend I recovered so long ago from the sands of long forgotten kings. Within its pages lie the secrets of life, death ...and undeath. -- Azaran the Cruel',
}

export const YoraSkull: CardBase = {
  type: 'instant',
  name: "Saint Yora's Skull",
  strength: 0,
  cost: 5,
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
