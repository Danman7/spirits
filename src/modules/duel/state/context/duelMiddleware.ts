import { DuelAction } from 'src/modules/duel/state/duelActionTypes'
import { DuelState } from 'src/modules/duel/state/duelStateTypes'
import { duelTriggers } from 'src/modules/duel/state/triggers'

export const duelMiddleware = (
  state: DuelState,
  action: DuelAction,
  dispatch: (action: DuelAction) => void,
) =>
  duelTriggers.forEach(
    ({ predicate, effect }) =>
      predicate(state, action) && effect({ state, action, dispatch }),
  )
