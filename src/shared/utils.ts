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
 * Determines if coin or coins should be returned
 * @example getCoinsMessage(1) // coin
 * @example getCoinsMessage(3) // coins
 */
export const getCoinsMessage = (coins: number) =>
  `${coins} ${coins > 1 ? 'coins' : 'coin'}`
