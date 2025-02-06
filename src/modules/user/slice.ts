import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User } from 'src/shared/types'

export const initialState: User = {
  id: '',
  name: '',
  deck: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadUser: (state, action: PayloadAction<User>) => {
      return { ...state, ...action.payload }
    },
  },
})

const { actions, reducer } = userSlice

export const { loadUser } = actions

export const userReducer = reducer
