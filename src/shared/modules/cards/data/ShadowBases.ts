import {
  DOWNWINDER_BOOST,
  GARRETT_COIN_GAIN,
} from 'src/shared/modules/cards/cards.constants'
import { Agent } from 'src/shared/modules/cards/cards.types'

export const GarrettMasterThief: Agent = {
  type: 'agent',
  name: 'Garrett: Master Thief',
  strength: 4,
  cost: 5,
  isElite: true,
  factions: ['Shadow'],
  categories: ['Thief'],
  description: [
    `Whenever your opponent spends coins, gain ${GARRETT_COIN_GAIN} coin.`,
  ],
  flavor:
    'His heart was clouded, and his balance was lost, but his abilities were unmatched. -- Keeper Annals',
}

export const DownwinderThief: Agent = {
  type: 'agent',
  name: 'Downwinder Thief',
  strength: 2,
  cost: 1,
  factions: ['Shadow'],
  categories: ['Thief'],
  description: [
    `When stealing coins from opponent boost self by ${DOWNWINDER_BOOST}.`,
  ],
  flavor:
    "We chose our profession in defiance of the greed of the monarchy. We will not live for the sake of taxes to fatten the noble's pockets. -- excerpt from the Downwinders Creed",
}
