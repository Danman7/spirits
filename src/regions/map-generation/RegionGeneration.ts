import { v4 as uuidv4 } from 'uuid'
import { RegionTypes } from 'src/regions'
import { getRandomItemFromArray } from 'src/utils'
import { RegionNames } from 'src/regions/RegionNames'

interface CreateNewBaseRegionOptions extends RegionTypes.RegionBase {
  populationNumber: number
}

export const createNewBaseRegion = ({
  name,
  foodMultiplier,
  populationNumber
}: CreateNewBaseRegionOptions): RegionTypes.Region => ({
  id: uuidv4(),
  name,
  foodMultiplier,
  population: Array.from(
    { length: populationNumber },
    () => RegionTypes.Dweller.HUNTER_GATHERER
  ),
  foodSupply: 0,
  connectedRegionIds: []
})

export const createRandomBaseRegions = (
  amount: number
): RegionTypes.Region[] => {
  const regions: RegionTypes.Region[] = []
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

export const connectRegions = (
  regions: RegionTypes.Region[]
): RegionTypes.Region[] => {
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
