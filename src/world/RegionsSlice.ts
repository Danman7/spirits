import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegionTypes } from 'src/world'
import { mode } from 'src/utils/gameUtils'

export type RegionsState = RegionTypes.GameRegion[]

export const initialState: RegionsState = []

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    populateRegions: (
      _state,
      action: PayloadAction<RegionTypes.ScenarioRegion[]>
    ) =>
      action.payload.map(scenarioRegion => ({
        ...scenarioRegion,
        population: []
      })),
    updatePopulations: state => {
      state.forEach(region => {
        const { population } = region

        const populationSize = population.length

        if (populationSize > 1) {
          const newPopulation = mode(population)

          if (newPopulation) {
            population.push(newPopulation)
          }
        }
      })
    }
  }
})

export const RegionActions = regionsSlice.actions

export const RegionsRducer = regionsSlice.reducer
