import { DuelAction, DuelState } from 'src/modules/duel'
import { duelTriggers } from 'src/modules/duel/state/triggers'

export const duelMiddleware = (
  state: DuelState,
  action: DuelAction,
  dispatch: React.ActionDispatch<[action: DuelAction]>,
  setLastAction: React.Dispatch<React.SetStateAction<DuelAction | null>>,
) =>
  duelTriggers.forEach(
    ({ predicate, effect }) =>
      predicate(state, action) &&
      effect({ state, action, dispatch, setLastAction }),
  )
