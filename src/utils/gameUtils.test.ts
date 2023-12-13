import { getRandomItemFromArray, mode } from 'src/utils/gameUtils'
import { RegionTypes } from 'src/world'

describe('Game Utils', () => {
  it('should get a random item from an array with getRandomItemFromArray', () => {
    const arr = ['Region 1', 'Region 2', 'Region 3', 'Region 4']
    const randomItem = getRandomItemFromArray(arr)

    expect(arr).toContain(randomItem)
  })

  it('should get the most recurring item from an array with mode', () => {
    const arr = [
      RegionTypes.PopulationType.Colonist,
      RegionTypes.PopulationType.Colonist,
      RegionTypes.PopulationType.Dweller
    ]

    expect(mode(arr)).toBe(RegionTypes.PopulationType.Colonist)

    const arr2: RegionTypes.PopulationType[] = []

    expect(mode(arr2)).toBe(undefined)
  })

  it('should return the last item from an array with mode when there is a tie', () => {
    const arr = [
      RegionTypes.PopulationType.Colonist,
      RegionTypes.PopulationType.Dweller
    ]

    expect(mode(arr)).toBe(RegionTypes.PopulationType.Dweller)

    const arr2 = [
      RegionTypes.PopulationType.Dweller,
      RegionTypes.PopulationType.Colonist
    ]

    expect(mode(arr2)).toBe(RegionTypes.PopulationType.Colonist)
  })
})
