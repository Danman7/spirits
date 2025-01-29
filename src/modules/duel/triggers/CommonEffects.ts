import { Effect } from 'src/app/listenerMiddleware'
import { discardCard, playCard, resolveTurn } from 'src/modules/duel/slice'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'

export const HandlePostPlay: Effect = (action, listenerApi) => {
  if (playCard.match(action)) {
    setTimeout(() => {
      const { getState, dispatch } = listenerApi
      const { players } = getState().duel
      const { cardId, playerId, shouldPay } = action.payload
      const { type } = players[playerId].cards[cardId]

      if (type === 'instant') {
        dispatch(discardCard({ cardId, playerId }))
      }

      if (shouldPay) {
        dispatch(resolveTurn())
      }
    }, ACTION_WAIT_TIMEOUT)
  }
}
