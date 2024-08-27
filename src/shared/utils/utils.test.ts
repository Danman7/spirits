import {
  generateUUID,
  getCoinsMessage,
  getRandomArrayItem
} from 'src/shared/utils/utils'

it('should generate a UUID', () => {
  expect(generateUUID()).toHaveLength(36)
})

it('should get a random item from an array', () => {
  const array = [1, 2, 3, 4]

  expect(array).toContain(getRandomArrayItem(array))
})

it('should show the proper coins message', () => {
  expect(getCoinsMessage(1)).toBe('1 coin')
  expect(getCoinsMessage(2)).toBe('2 coins')
})
