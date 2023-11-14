import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RegionTypes } from 'src/world'

export type RegionsState = RegionTypes.Region[]

export const initialState: RegionsState = []

export const regionsSlice = createSlice({
  name: 'regions',
  initialState,
  reducers: {
    populateRegions: (_state, action: PayloadAction<RegionTypes.Region[]>) =>
      action.payload
  }
})

export const RegionActions = regionsSlice.actions

export const RegionsRducer = regionsSlice.reducer
