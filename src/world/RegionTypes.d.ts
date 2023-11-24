export interface ScenarioRegion {
  id: string
  name: string
  border: string
  namePath: string
  connectedRegionIds: string[]
}

export interface GameRegion extends ScenarioRegion {
  population: number
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
