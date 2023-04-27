import { getRandomItemFromArray } from 'src/utils'

describe('General Utils', () => {
  it('should get a random item from an array with getRandomItemFromArray', () => {
    const arr = ['Region 1', 'Region 2', 'Region 3', 'Region 4']
    const randomItem = getRandomItemFromArray(arr)

    expect(arr).toContain(randomItem)
  })
})
