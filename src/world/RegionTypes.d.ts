export interface Region extends RegionBase {
  id: string
  name: string
  population: number
  foodSupply: number
  connectedRegionIds: string[]
  border: string
  namePath: string
}

export interface Scenario {
  name: string
  regions: Region[]
  width: number
  height: number
}
