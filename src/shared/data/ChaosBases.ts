import { AZARAN_BOOST, HAUNT_DAMAGE } from 'src/shared/data/constants'
import { CardBase } from 'src/shared/types'

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
