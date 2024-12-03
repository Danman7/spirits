import {
  CardBase,
  DuelCard,
  GetOnPlayPredicate,
} from 'src/features/cards/types'
import { CARD_STACKS } from 'src/features/duel/constants'
import { CardStack, Player, PlayerStacks } from 'src/features/duel/types'
import { FACTION_COLOR_MAP } from 'src/shared/constants'

/**
 * Generates a unique id for cards, players, etc.
 * @example generateUUID() // 7ea1f8cb-a150-479a-9a00-3227664ac071
 */
export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

/**
 * Returns A random item from the passed array
 * @example getRandomArrayItem(['Guard', 'Hammerite', 'Undead']) // 'Hammerite'
 */
export const getRandomArrayItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]

export const shuffleArray = <T>(array: T[]): T[] => {
  const arrayCopy = [...array]
  let remainingItemsAmount = arrayCopy.length
  let index: number
  let remainingItem: T

  while (remainingItemsAmount) {
    index = Math.floor(Math.random() * remainingItemsAmount--)

    remainingItem = arrayCopy[remainingItemsAmount]
    arrayCopy[remainingItemsAmount] = arrayCopy[index]
    arrayCopy[index] = remainingItem
  }

  return arrayCopy
}

export const getCoinsMessage = (coins: number) =>
  `${coins} ${coins > 1 ? 'coins' : 'coin'}`

/**
 * @param categories An array of card categories
 * @returns A string of card categories separated by a comma
 * @example joinCardCategories(['Hammerite', 'Undead']) // 'Hammerite, Undead'
 */
export const joinCardCategories = (categories: CardBase['categories']) =>
  categories.join(', ')

/**
 * @param factions An array of card factions (Order, Chaos, Shadow)
 * @returns A color string variable or a diagonal gradient if multiple factions are passed
 * @example getFactionColor(['Chaos']) // var(--chaos-faction-color)
 * @example getFactionColor(['Order', 'Shadow']) // `linear-gradient(300deg, var(--order-faction-color), var(--shadow-faction-color))`
 */
export const getFactionColor = (factions: CardBase['factions']): string => {
  const firstColor = FACTION_COLOR_MAP[factions[0]]

  if (factions.length === 1) {
    return firstColor
  }

  return `linear-gradient(300deg, ${firstColor}, ${
    FACTION_COLOR_MAP[factions[1]]
  })`
}

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
 * This method plugs in the redux toolkit listener middleware and generates a Boolean predicate specifically for on card play triggers. Every on play should check if the card name is the correct one apart from other conditions.
 * @param action The fired action
 * @param currentState Current state from reducer
 * @param cardName String name of card from base
 * @returns true or false based on the arguments
 * @example
 * getOnPlayPredicate(action, currentState, 'Hammerite Novice') // action.type === 'duel/playCard' && currentState.playedCard.name === 'Hammerite Novice'
 */
export const getOnPlayPredicate: GetOnPlayPredicate = (
  action,
  currentState,
  cardName,
) =>
  action.type === 'duel/playCard' &&
  currentState.duel.players[action.payload.playerId].cards[
    action.payload.cardId
  ].name === cardName

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
