import { FACTION_COLOR_MAP } from 'src/shared/constants'
import { CardBase } from 'src/shared/types'

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })

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

export const deepClone = <T>(object: T) => JSON.parse(JSON.stringify(object))

export const joinStringArrayWithComma = (categories: CardBase['categories']) =>
  categories.join(', ')

export const getCardFactionColor = (factions: CardBase['factions']): string => {
  const firstColor = FACTION_COLOR_MAP[factions[0]]

  if (factions.length === 1) return firstColor

  return `linear-gradient(300deg, ${firstColor}, ${
    FACTION_COLOR_MAP[factions[1]]
  })`
}
