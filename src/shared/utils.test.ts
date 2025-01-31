import { Haunt } from 'src/shared/data'
import { defaultTheme } from 'src/shared/styles'
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

const { orderFaction, chaosFaction, shadowFaction } = defaultTheme.colors

it('should get the proper faction color', () => {
  expect(getFactionColor(['Chaos'])).toBe(chaosFaction)
  expect(getFactionColor(['Order'])).toBe(orderFaction)
  expect(getFactionColor(['Shadow'])).toBe(shadowFaction)
  expect(getFactionColor(['Chaos', 'Shadow'])).toBe(
    `linear-gradient(300deg, ${chaosFaction}, ${shadowFaction})`,
  )
})
