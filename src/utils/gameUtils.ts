import { RegionTypes } from 'src/world'

export const getRandomItemFromArray = <T>(arr: T[]): T | undefined =>
  arr[Math.floor(Math.random() * arr.length)]

export const mode = (
  array: RegionTypes.PopulationType[]
): RegionTypes.PopulationType => {
  const sortedArray = array.sort(
    (a, b) =>
      array.filter(v => v === a).length - array.filter(v => v === b).length
  )

  return sortedArray[sortedArray?.length - 1]
}
