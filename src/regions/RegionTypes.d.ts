export interface RegionBase {
  name: string
  foodMultiplier: number
}

export interface Region extends RegionBase {
  id: string
  population: number
  foodSupply: number
  connectedRegionIds: string[]
  border: string
  namePath: string
}
