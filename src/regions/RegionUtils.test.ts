import { MapGeneration, RegionUtils } from 'src/regions'

describe('Region Utils', () => {
  it('should sort regions next to each other as neighbours via sortRegionsByNeighbours', () => {
    const regions = MapGeneration.generateMap(10)

    var sortedRegions = RegionUtils.sortRegionsByNeighbours(regions)

    expect(sortedRegions[0].connectedRegionIds).toContain(sortedRegions[1].id)
  })
})
