import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegionTypes } from 'src/regions'

export type RegionsState = RegionTypes.Region[]

export const initialState: RegionsState = []

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    populateRegions: (_state, action: PayloadAction<RegionTypes.Region[]>) =>
      action.payload,
    advanceTurn: (state, action: PayloadAction<number>) => {
      state.forEach(region => {
        const { foodMultiplier, population } = region

        const hunterGatherers = population.filter(
          dweller => dweller === RegionTypes.Dweller.HUNTER_GATHERER
        ).length

        region.foodSupply += hunterGatherers * foodMultiplier * action.payload
      })
    }
  }
})

export const RegionActions = regionsSlice.actions

export const RegionsRducer = regionsSlice.reducer
