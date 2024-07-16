import { coinToss, generateUUID } from './gameUtils'

describe('Game Utils', () => {
  it('should generate a UUID', () => {
    expect(generateUUID()).toHaveLength(36)
  })

  it('should toss a coin', () => {
    expect([true, false]).toContain(coinToss())
    expect([true, false]).toContain(!coinToss())
  })
})
