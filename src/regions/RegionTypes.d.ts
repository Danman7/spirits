export enum Dweller {
  BUILDER = 'Builder',
  HUNTER_GATHERER = 'Hunter/Gatherer'
}

export interface RegionBase {
  name: string
  foodMultiplier: number
}

export interface Region extends RegionBase {
  id: string
  population: Dweller[]
  foodSupply: number
}
