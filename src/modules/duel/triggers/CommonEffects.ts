import { Effect } from 'src/app/listenerMiddleware'
import { playCard, resolveTurn } from 'src/modules/duel/slice'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'

export const HandlePostPlay: Effect = (action, listenerApi) => {
  if (playCard.match(action)) {
    setTimeout(() => {
      const { dispatch } = listenerApi
      const { shouldPay } = action.payload

      if (shouldPay) {
        dispatch(resolveTurn())
      }
    }, ACTION_WAIT_TIMEOUT)
  }
}
