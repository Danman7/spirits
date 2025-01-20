import {
  Action,
  createListenerMiddleware,
  ListenerEffectAPI,
} from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/app/store'
import { PlayAllHammeriteNoviceCopies } from 'src/features/duel/effects'
import { HammeriteNoviceOnPlay } from 'src/features/duel/predicates'

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
  predicate: HammeriteNoviceOnPlay,
  effect: PlayAllHammeriteNoviceCopies,
})
