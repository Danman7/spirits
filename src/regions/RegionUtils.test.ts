import { createRandomRegions } from './RegionUtils'

describe('RegionUtils', () => {
  it('should generate random regions with createRandomRegions', () => {
    const numberOfRegions = 10
    const regions = createRandomRegions(numberOfRegions)

    expect(regions.length).toBe(numberOfRegions)
  })
})
