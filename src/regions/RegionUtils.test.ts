import { createRandomRegions } from './RegionUtils'

describe('RegionUtils', () => {
  it('should generate random regions with createRandomRegions', () => {
    const regions = createRandomRegions(10)

    expect(regions.length).toBe(10)
  })
})
