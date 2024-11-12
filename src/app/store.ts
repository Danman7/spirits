import { Action, configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { listenerMiddleware } from 'src/app/listenerMiddleware'

import duelReducer, { DuelActionTypes } from 'src/features/duel/slice'
import { DuelState } from 'src/features/duel/types'

const storeConfiguration: ConfigureStoreOptions<
  { duel: DuelState },
  | Action<DuelActionTypes>
  | Action<'listenerMiddleware/add'>
  | Action<'listenerMiddleware/removeAll'>
> = {
  reducer: {
    duel: duelReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
}

const store = configureStore(storeConfiguration)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const configureStoreWithPreloadedState = (preloadedState?: RootState) =>
  configureStore({ ...storeConfiguration, preloadedState })

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export default store
