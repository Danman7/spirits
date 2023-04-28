import {
  connectRegions,
  createRandomBaseRegions
} from 'src/regions/map-generation/RegionGeneration'

describe('Region Generation', () => {
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
    const regions = createRandomBaseRegions(10)

    const connectedRegions = connectRegions(regions)

    expect(connectedRegions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          connectedRegionIds: expect.arrayContaining([expect.any(String)])
        })
      ])
    )
  })
})
