import { v4 as uuidv4 } from 'uuid'

import { Dweller, Region, RegionBase } from './RegionTypes.d'
import { RegionNames } from './RegionNames'
import { getRandomItemFromArray } from '../utils'

interface createNewRegionOptions extends RegionBase {
  populationNumber: number
}

const createNewRegion = ({
  name,
  foodMultiplier,
  populationNumber,
}: createNewRegionOptions): Region => ({
  id: uuidv4(),
  name,
  foodMultiplier,
  population: Array.from(
    { length: populationNumber },
    () => Dweller.HUNTER_GATHERER
  ),
  foodSupply: 0,
})

export const createRandomRegions = (amount: number) => {
  const regions: Region[] = []
  const usedNames: string[] = []

  for (let index = 0; index < amount; index++) {
    const name = getRandomItemFromArray(
      RegionNames.filter((name) => !usedNames.includes(name))
    )

    if (name) {
      usedNames.push(name)

      regions.push(
        createNewRegion({ name, foodMultiplier: 1, populationNumber: 3 })
      )
    }
  }

  return regions
}
