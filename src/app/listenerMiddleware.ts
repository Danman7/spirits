import {
  Action,
  createListenerMiddleware,
  ListenerEffectAPI,
} from '@reduxjs/toolkit'
import { AppDispatch, RootState } from 'src/app'
import {
  Effects,
  Predicates,
  PredicatesMap,
  PredicatesName,
} from 'src/modules/duel'

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

Object.keys(PredicatesMap).forEach((predicate: PredicatesName) => {
  startAppListening({
    predicate: Predicates[predicate],
    effect: Effects[PredicatesMap[predicate]],
  })
})
