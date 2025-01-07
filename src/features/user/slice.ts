import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'src/shared/types'

export const initialState: User = {
  id: '',
  name: '',
  cards: {},
}

export const userSlice = createSlice({
  name: 'duel',
  initialState,
  reducers: {
    loadUser: (
      state,
      action: PayloadAction<{
        id: string
      }>,
    ) => {
      const { id } = action.payload

      return { ...state, id }
    },
  },
})

const { actions, reducer } = userSlice

export const { loadUser } = actions

export const userReducer = reducer
