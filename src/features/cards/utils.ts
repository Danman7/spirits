import { FACTION_COLOR_MAP } from 'src/features/cards/constants'
import {
  CardBase,
  DuelCard,
  GetOnPlayPredicate,
} from 'src/features/cards/types'
import { generateUUID } from 'src/shared/utils'

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
