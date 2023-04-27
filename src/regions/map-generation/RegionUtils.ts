import { getRandomItemFromArray } from '../../utils'
import { v4 as uuidv4 } from 'uuid'
import { RegionNames } from '../RegionNames'
import { Dweller, Region, RegionBase } from '../RegionTypes.d'

interface CreateNewBaseRegionOptions extends RegionBase {
  populationNumber: number
}

const createNewBaseRegion = ({
  name,
  foodMultiplier,
  populationNumber
}: CreateNewBaseRegionOptions): Region => ({
  id: uuidv4(),
  name,
  foodMultiplier,
  population: Array.from(
    { length: populationNumber },
    () => Dweller.HUNTER_GATHERER
  ),
  foodSupply: 0,
  connectedRegionIds: []
})

export const createRandomBaseRegions = (amount: number): Region[] => {
  const regions: Region[] = []
  const usedNames: string[] = []

  for (let index = 0; index < amount; index++) {
    const name = getRandomItemFromArray(
      RegionNames.filter(regionName => !usedNames.includes(regionName))
    )

    if (name) {
      usedNames.push(name)

      regions.push(
        createNewBaseRegion({ name, foodMultiplier: 1, populationNumber: 3 })
      )
    }
  }

  return regions
}

export const connectRegions = (regions: Region[]): Region[] => {
  const connectedRegionIds: string[] = []

  regions.forEach(region => {
    const randomRegion = getRandomItemFromArray(
      regions.filter(
        filteredRegion => !connectedRegionIds.includes(filteredRegion.id)
      )
    )

    if (randomRegion) {
      const { id } = randomRegion

      region.connectedRegionIds.push(id)
      connectedRegionIds.push(id)
    }
  })

  return regions
}
