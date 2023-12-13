export interface ScenarioRegion {
  id: string
  name: string
  border: string
  namePath: string
  connectedRegionIds: string[]
}

export const enum PopulationType {
  Colonist = 'Colonist',
  Dweller = 'Dweller'
}

export interface GameRegion extends ScenarioRegion {
  population: PopulationType[]
}

export interface Scenario {
  name: string
  regions: ScenarioRegion[]
  width: number
  height: number
}

export interface TestScenario extends Scenario {
  regions: GameRegion[]
}
