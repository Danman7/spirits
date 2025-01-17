import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'src/app/store'

const getUserState = (state: RootState) => state.user

export const getUserId = createSelector(
  getUserState,
  (userState) => userState.id,
)
