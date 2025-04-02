import type { DuelAction, DuelState } from 'src/modules/duel/state'
import { duelTriggers } from 'src/modules/duel/state/triggers'

export const duelProviderMiddleware = (
  state: DuelState,
  action: DuelAction,
  dispatch: (action: DuelAction) => void,
) =>
  duelTriggers.forEach(
    ({ predicate, effect }) =>
      predicate(state, action) && effect({ state, action, dispatch }),
  )
