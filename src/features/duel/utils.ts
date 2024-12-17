import { AppDispatch } from 'src/app/store'
import { CardBase } from 'src/features/cards/types'
import { CARD_STACKS } from 'src/features/duel/constants'
import { initializeEndTurn, moveCardToDiscard } from 'src/features/duel/slice'
import {
  CardStack,
  DuelCard,
  DuelState,
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

interface MoveCardBetweenStacksArgs {
  state: DuelState
  playerId: Player['id']
  movedCardId: string
  to: CardStack
  inFront?: boolean
}

/**
 * @param base A card base object (e.g. HammeriteNovice or Zombie)
 * @returns A ready for duel card object with unique id and base properties for reference
 * @example createDuelCard({...Haunt}) // {...Haunt, id: 'e4g34', base: {...Haunt}}
 */
export const moveCardBetweenStacks = ({
  state,
  playerId,
  movedCardId,
  to,
  inFront,
}: MoveCardBetweenStacksArgs) => {
  const { players } = state

  CARD_STACKS.forEach((stack) => {
    if (stack !== to) {
      players[playerId][stack] = players[playerId][stack].filter(
        (cardId) => cardId !== movedCardId,
      )
    }
  })

  players[playerId][to] = inFront
    ? [movedCardId, ...players[playerId][to]]
    : [...players[playerId][to], movedCardId]
}

interface triggerPostCardPlayProps {
  dispatch: AppDispatch
  playerId: string
  card: DuelCard
}

/**
 * A utility that triggers all actions that have to happen after a card is played.
 */
export const triggerPostCardPlay = ({
  dispatch,
  playerId,
  card,
}: triggerPostCardPlayProps) => {
  const { type, id } = card

  if (type === 'instant') {
    dispatch(moveCardToDiscard({ cardId: id, playerId }))
  }

  dispatch(initializeEndTurn())
}
