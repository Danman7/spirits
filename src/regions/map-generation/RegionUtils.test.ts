import { connectRegions, createRandomBaseRegions } from './RegionUtils'

describe('RegionUtils', () => {
  it('should generate N amount of random regions with createRandomBaseRegions', () => {
    const numberOfRegions = 10
    const regions = createRandomBaseRegions(numberOfRegions)

    expect(regions.length).toBe(numberOfRegions)

    expect(regions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          foodMultiplier: expect.any(Number),
          population: expect.any(Array)
        })
      ])
    )
  })

  it('should create connections between the regions with connectRegions', () => {
    const numberOfRegions = 10
    const regions = createRandomBaseRegions(numberOfRegions)

    const connectedRegions = connectRegions(regions)

    expect(connectedRegions.length).toBe(numberOfRegions)

    expect(connectedRegions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connectedRegionIds: expect.arrayContaining([expect.any(String)])
        })
      ])
    )
  })
})
