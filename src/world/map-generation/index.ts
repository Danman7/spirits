import { RegionTypes } from 'src/world'
import { createRandomBaseRegions } from 'src/world/map-generation/RegionGeneration'

export const generateMap = (amount: number): RegionTypes.Region[] => {
  const baseRegions = createRandomBaseRegions(amount)

  return baseRegions
}
