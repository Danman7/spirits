import { VIKTORIA_COIN_GAIN } from 'src/shared/data'
import { CardBase } from 'src/shared/types'

export const ViktoriaThiefPawn: CardBase = {
  type: 'agent',
  name: 'Viktoria: Thiefs-pawn',
  strength: 4,
  cost: 5,
  rank: 'unique',
  factions: ['Chaos', 'Shadow'],
  categories: ['Fence', 'Pagan'],
  description: [
    `Whenever you steal coins from the opponent, gain ${VIKTORIA_COIN_GAIN} coin.`,
  ],
  flavor:
    'About your Victoria, nothing yet. Walks she an inch above the ground, for all the dirt of her footprints have I found. -- From a report to Lord Bafford',
}
