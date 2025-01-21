import { Haunt } from 'src/shared/data'
import {
  generateUUID,
  getFactionColor,
  getRandomArrayItem,
  joinCardCategories,
  shuffleArray,
} from 'src/shared/utils'

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
  expect(joinCardCategories(Haunt.categories)).toBe('Undead, Hammerite')
})

it('should get the proper faction color', () => {
  expect(getFactionColor(['Chaos'])).toBe('var(--chaos-faction-color)')
  expect(getFactionColor(['Order'])).toBe('var(--order-faction-color)')
  expect(getFactionColor(['Shadow'])).toBe('var(--shadow-faction-color)')
  expect(getFactionColor(['Chaos', 'Shadow'])).toBe(
    `linear-gradient(300deg, ${'var(--chaos-faction-color)'}, ${'var(--shadow-faction-color)'})`,
  )
})
