import { RegionTypes } from 'src/regions'

export const sortRegionsByNeighbours = (
  regions: RegionTypes.Region[]
): RegionTypes.Region[] => {
  const sortedRegions: RegionTypes.Region[] = []

  sortedRegions.push(regions[0])

  const addConnectedRegions = (addedRegion: RegionTypes.Region) => {
    addedRegion.connectedRegionIds.forEach(connectedRegionId => {
      const connectedRegion = regions.find(
        region => region.id === connectedRegionId
      )

      if (connectedRegion && !sortedRegions.includes(connectedRegion)) {
        sortedRegions.push(connectedRegion)
      }
    })
  }

  for (let index = 0; index < regions.length; index++) {
    addConnectedRegions(sortedRegions[sortedRegions.length - 1])
  }

  return sortedRegions
}
