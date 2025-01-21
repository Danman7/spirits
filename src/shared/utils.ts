import { DuelCard } from 'src/modules/duel/types'
import { FACTION_COLOR_MAP } from 'src/shared/constants'
import { CardBase } from 'src/shared/types'
import { CardBases } from 'src/shared/data'

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
 * Returns a random item from the passed array
 * @example getRandomArrayItem(['Guard', 'Hammerite', 'Undead']) // 'Hammerite'
 */
export const getRandomArrayItem = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]

/**
 * Shuffles the items in an array using Fisher–Yates algorithm
 * @example shuffleArray(['Guard', 'Hammerite', 'Undead']) // [ 'Hammerite', 'Undead', 'Guard']
 */
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

/**
 * Clone an object using the JSON method.
 */
export const deepClone = <T>(object: T) => JSON.parse(JSON.stringify(object))

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

export const getDuelCardsBase = (card: DuelCard): CardBase | undefined =>
  Object.values(CardBases).find(({ name }) => name === card.name)
