import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegionTypes } from 'src/world'

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
        population: 0
      }))
  }
})

export const RegionActions = regionsSlice.actions

export const RegionsRducer = regionsSlice.reducer
