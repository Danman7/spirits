import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Dweller, Region } from './RegionTypes.d'

export type RegionsState = Region[]

const initialState: RegionsState = []

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    populateRegions: (state, action: PayloadAction<Region[]>) => action.payload,
    passSeason: (state, action: PayloadAction<number>) => {
      state.forEach((region) => {
        const { foodMultiplier, population } = region

        const hunterGatherers = population.filter(
          (dweller) => dweller === Dweller.HUNTER_GATHERER
        ).length

        region.foodSupply += hunterGatherers * foodMultiplier * action.payload
      })
    },
  },
})

export const { populateRegions, passSeason } = regionsSlice.actions

export const regionsRducer = regionsSlice.reducer
