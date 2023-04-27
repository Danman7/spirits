import { Region } from '../RegionTypes'
import { connectRegions, createRandomBaseRegions } from './RegionUtils'

export const generateMap = (amount: number): Region[] => {
  const baseRegions = createRandomBaseRegions(amount)

  const connectedRegions = connectRegions(baseRegions)

  return connectedRegions
}
