import {
  AZARAN_BOOST,
  BROTHER_SACHELMAN_BOOST,
  DOWNWINDER_BOOST,
  ELEVATED_ACOLYTE_BOOST,
  GARRETT_COIN_GAIN,
  HAUNT_DAMAGE,
  VIKTORIA_COIN_GAIN
} from 'src/Cards/constants'
import { Card, CardFaction, CardType } from 'src/Cards/CardTypes'
import { getCoinsMessage } from 'src/shared/utils/utils'

export const Zombie: Card = {
  name: 'Zombie',
  strength: 3,
  cost: 1,
  factions: [CardFaction.Chaos],
  types: [CardType.Undead],
  description:
    'If this card is in your discard pile when a Necromancer is played, bring it back to your board.',
  flavor:
    "The zombie's antipathy for all living creatures is both its strength and weakness."
}

export const Haunt: Card = {
  name: 'Haunt',
  strength: 7,
  cost: 3,
  factions: [CardFaction.Chaos],
  types: [CardType.Undead, CardType.Hammerite],
  description: `Whenever your opponent plays a card with strength, damage it by ${HAUNT_DAMAGE}.`,
  flavor:
    'These haunts who inhabit the bodies of my brethren... they must all be killed. -- The apparition of Brother Murus'
}

export const HammeriteNovice: Card = {
  name: 'Hammerite Novice',
  strength: 3,
  cost: 1,
  factions: [CardFaction.Order],
  types: [CardType.Hammerite],
  description:
    'On play if any hammerite is on the table, play all Hammerite Novice cards you have.',
  flavor:
    'This novice has been instructed in the rules and strictures of the Order and has sworn his warrants to be silent in his vigils.',
  onPlay: 'HammeriteNoviceOnPlay'
}

export const ElevatedAcolyte: Card = {
  name: 'Elevated Acolyte',
  strength: 5,
  cost: 3,
  factions: [CardFaction.Order],
  types: [CardType.Hammerite],
  description: `If a card is boosted next to Elevated Acolyte, boost Elevated Acolyte by ${ELEVATED_ACOLYTE_BOOST}.`,
  flavor:
    'He will endure a standard three-year contract of service, at the end of which he will be considered for indoctrination as an Elevated Acolyte.'
}

export const TempleGuard: Card = {
  name: 'Temple Guard',
  strength: 5,
  cost: 4,
  factions: [CardFaction.Order],
  types: [CardType.Hammerite, CardType.Guard],
  description: 'When this card is attacked, it retaliates.',
  flavor:
    'Thy hammer pounds the nail, holds the roof-beam. Thy hammer strikes the iron, shapes the cauldron.'
}

export const BrotherSachelman: Card = {
  name: 'Brother Sachelman',
  strength: 5,
  cost: 3,
  factions: [CardFaction.Order],
  types: [CardType.Hammerite],
  description: `On play boost any allied Hammerite on board with lower strength than this card's strength by ${BROTHER_SACHELMAN_BOOST}`,
  flavor:
    'May the Hammer fall on the unrighteous. Officially, Brother Sachelman',
  onPlay: 'BrotherSachelmanOnPlay'
}

export const ViktoriaThiefPawn: Card = {
  name: 'Viktoria: Thiefs-pawn',
  strength: 4,
  cost: 5,
  factions: [CardFaction.Chaos, CardFaction.Shadow],
  types: [CardType.Fence, CardType.Pagan],
  description: `Whenever you steal coins from the opponent, gain ${getCoinsMessage(
    VIKTORIA_COIN_GAIN
  )}.`,
  flavor:
    'About your Victoria, nothing yet. Walks she an inch above the ground, for all the dirt of her footprints have I found. -- From a report to Lord Bafford'
}

export const GarrettMasterThief: Card = {
  name: 'Garrett: Master Thief',
  strength: 4,
  cost: 5,
  factions: [CardFaction.Shadow],
  types: [CardType.Thief],
  description: `Whenever your opponent spends coins, gain ${getCoinsMessage(
    GARRETT_COIN_GAIN
  )}.`,
  flavor:
    'His heart was clouded, and his balance was lost, but his abilities were unmatched. -- Keeper Annals'
}

export const DownwinderThief: Card = {
  name: 'Downwinder Thief',
  strength: 2,
  cost: 1,
  factions: [CardFaction.Shadow],
  types: [CardType.Thief],
  description: `When stealing coins from opponent boost self by ${DOWNWINDER_BOOST}.`,
  flavor:
    "We chose our profession in defiance of the greed of the monarchy. We will not live for the sake of taxes to fatten the noble's pockets. -- excerpt from the Downwinders Creed"
}

export const AzaranTheCruel: Card = {
  name: 'Azaran the Cruel',
  strength: 5,
  cost: 5,
  factions: [CardFaction.Chaos],
  types: [CardType.Necromancer],
  description: `On playOn play boost self by ${AZARAN_BOOST} for each Undead card in the discard pile.`,
  flavor:
    "Be warned! The truth is hidden from the unworthy. Blacken thy heart, or face the prisoners of flesh. -- Azaran's last mortal written words"
}

export const BookOfAsh: Card = {
  name: 'The Book of Ash',
  cost: 5,
  strength: 0,
  factions: [CardFaction.Chaos],
  types: [CardType.Artifact],
  description: 'Summon 2 zombies.',
  flavor:
    'I owe my transcendence to the Book of Ash, that tome of legend I recovered so long ago from the sands of long forgotten kings. Within its pages lie the secrets of life, death ...and undeath. -- Azaran the Cruel'
}
