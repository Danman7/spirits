import {
  Action,
  createListenerMiddleware,
  ListenerEffectAPI,
} from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/app/store'
import { Effects, Predicates } from 'src/features/duel'

export type Predicate = (
  action: Action,
  currentState: RootState,
  previousState: RootState,
) => boolean

export type ListenerApi = ListenerEffectAPI<RootState, AppDispatch>

export type Effect = (action: Action, listenerApi: ListenerApi) => void

export const listenerMiddleware = createListenerMiddleware()

const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()

startAppListening({
  predicate: Predicates.HammeriteNoviceOnPlay,
  effect: Effects.PlayAllHammeriteNoviceCopies,
})
