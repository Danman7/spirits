import { Effect } from 'src/app'
import { playCard, resolveTurn, updateAgent } from 'src/modules/duel'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
import { HighPriestMarkander } from 'src/shared/data'
import { AgentWithCounter } from 'src/shared/types'

export const HandlePostPlay: Effect = (action, listenerApi) => {
  if (playCard.match(action)) {
    setTimeout(() => {
      const { dispatch, getState } = listenerApi
      const { players } = getState().duel
      const { shouldPay, cardId, playerId } = action.payload

      if (shouldPay) dispatch(resolveTurn())

      const { cards } = players[playerId]
      const { categories } = cards[cardId]

      const HighPriest = Object.entries(cards).find(
        ([, card]) => card.name === HighPriestMarkander.name,
      )

      if (!HighPriest) return

      const [priestId, card] = HighPriest

      const priest = card as AgentWithCounter

      if (categories.includes('Hammerite') && priest.counter > 0) {
        dispatch(
          updateAgent({
            playerId,
            cardId: priestId,
            update: {
              counter: priest.counter - 1,
            },
          }),
        )
      }
    }, ACTION_WAIT_TIMEOUT)
  }
}
