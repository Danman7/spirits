import { RegionTypes } from 'src/regions'
import { createRandomBaseRegions } from 'src/regions/map-generation/RegionGeneration'

export const generateMap = (amount: number): RegionTypes.Region[] => {
  const baseRegions = createRandomBaseRegions(amount)

  return baseRegions
}
