import { CardBase } from 'src/features/cards/types'
import { CARD_STACKS } from 'src/features/duel/constants'
import {
  CardStack,
  DuelCard,
  Player,
  PlayerStacks,
} from 'src/features/duel/types'
import { generateUUID } from 'src/shared/utils'

/**
 * @param base A card base object (e.g. HammeriteNovice or Zombie)
 * @returns A ready for duel card object with unique id and base properties for reference
 * @example createDuelCard({...Haunt}) // {...Haunt, id: 'e4g34', base: {...Haunt}}
 */
export const createDuelCard = (base: CardBase): DuelCard => ({
  ...base,
  id: generateUUID(),
  strength: base.strength || 0,
  base: {
    strength: base.strength || 0,
    cost: base.cost,
  },
})

/**
 * @param card A ready for duel card object
 * @returns The same card object with a new unique id and reset base properties
 */
export const copyDuelCard = (card: DuelCard): DuelCard => ({
  ...card,
  strength: card.base.strength || 0,
  cost: card.base.cost,
  id: generateUUID(),
})

/**
 * Returns an array of ids of all cards in a player's hand that cost within the player's coins reserve.
 * @param player A Player object
 */
export const getPlayableCardIds = (player: Player) =>
  player.hand.filter((cardId) => player.cards[cardId].cost <= player.coins)

/**
 * Takes a record with a card stack as key and an array of card bases as value and returns a partial player object with normalized cards and stacks with the card ids to be concatenated with a player object.
 * @example
 * normalizePlayerCards({
	 board: [TempleGuard],
	hand: [HammeriteNovice],
})
*/
export const normalizePlayerCards = (
  stacks: Partial<Record<CardStack, CardBase[]>>,
): PlayerStacks => {
  const partialPlayer: PlayerStacks = {
    deck: [],
    hand: [],
    board: [],
    discard: [],
    cards: {},
  }

  CARD_STACKS.forEach((stack) => {
    if (stacks[stack]) {
      stacks[stack].forEach((cardBase) => {
        const card = createDuelCard(cardBase)

        partialPlayer.cards = {
          ...partialPlayer.cards,
          [card.id]: card,
        }
        partialPlayer[stack] = [...partialPlayer[stack], card.id]
      })
    }
  })

  return partialPlayer
}
