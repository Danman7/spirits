import { coinToss, generateUUID, getRandomArrayItem } from './gameUtils'

describe('Game Utils', () => {
  it('should generate a UUID', () => {
    expect(generateUUID()).toHaveLength(36)
  })

  it('should toss a coin', () => {
    expect([true, false]).toContain(coinToss())
    expect([true, false]).toContain(!coinToss())
  })

  it('should get a random item from an array', () => {
    const array = [1, 2, 3, 4]

    expect(array).toContain(getRandomArrayItem(array))
    expect(getRandomArrayItem([])).toBeNull()
  })
})
