import type {
  DuelAction,
  DuelState,
} from 'src/modules/duel/state/duelState.types'
import { duelReducerRedraw } from 'src/modules/duel/state/reducer/reducerRedraw'
import { duelReducerSetup } from 'src/modules/duel/state/reducer/reducerSetup'
import { duelReducerTurns } from 'src/modules/duel/state/reducer/reducerTurns'

export const initialState: DuelState = {
  players: {},
  cards: {},
  playerOrder: ['', ''],
  attackingQueue: [],
  phase: 'Pre-duel',
  logs: [],
  targeting: { showTargetingModal: false, validTargets: [] },
}

export const duelReducer = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState =>
  duelReducerSetup(state, action) ??
  duelReducerRedraw(state, action) ??
  duelReducerTurns(state, action) ??
  state
