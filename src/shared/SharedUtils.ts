import { Card } from 'src/shared/modules/cards/CardTypes'

export const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0
    const value = char === 'x' ? random : (random & 0x3) | 0x8
    return value.toString(16)
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

export const joinStringArrayWithComma = (categories: Card['categories']) =>
  categories.join(', ')

export const getCoinsMessage = (amount: number) =>
  amount > 1 ? 'coins' : 'coin'

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))
