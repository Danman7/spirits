import { RegionTypes } from 'src/regions'
import {
  connectRegions,
  createRandomBaseRegions
} from 'src/regions/map-generation/RegionUtils'

export const generateMap = (amount: number): RegionTypes.Region[] => {
  const baseRegions = createRandomBaseRegions(amount)

  const connectedRegions = connectRegions(baseRegions)

  return connectedRegions
}
