import { Haunt } from 'src/shared/modules/cards'
import {
  generateUUID,
  getRandomArrayItem,
  joinStringArrayWithComma,
  shuffleArray,
} from 'src/shared/shared.utils'

it('should generate a UUID', () => {
  expect(generateUUID()).toHaveLength(36)
})

it('should get a random item from an array', () => {
  const array = [1, 2, 3, 4]

  expect(array).toContain(getRandomArrayItem(array))
})

it('should shuffle an array', () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]

  const shuffledArray = shuffleArray([...array])

  expect(shuffledArray).not.toEqual(array)

  for (let index = 0; index < array.length; index++) {
    expect(shuffledArray).toContain(array[index])
  }
})

it('should return a joined types string for a card', () => {
  expect(joinStringArrayWithComma(Haunt.categories)).toBe('Undead, Hammerite')
})
