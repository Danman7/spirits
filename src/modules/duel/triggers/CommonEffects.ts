import { Effect } from 'src/app'
import { playCard, resolveTurn, updateCard } from 'src/modules/duel'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'

export const HandlePostPlay: Effect = (action, listenerApi) => {
  if (playCard.match(action)) {
    setTimeout(() => {
      const { dispatch, getState } = listenerApi
      const { players } = getState().duel
      const { shouldPay, cardId, playerId } = action.payload

      if (shouldPay) dispatch(resolveTurn())

      const { cards } = players[playerId]
      const { categories } = cards[cardId]
      const HighPriest = Object.values(cards).find(
        ({ baseName }) => baseName === 'HighPriestMarkander',
      )

      if (
        categories.includes('Hammerite') &&
        HighPriest &&
        (HighPriest.counter as number) > 0
      ) {
        dispatch(
          updateCard({
            playerId,
            cardId: HighPriest.id,
            update: {
              counter: (HighPriest.counter as number) - 1,
            },
          }),
        )
      }
    }, ACTION_WAIT_TIMEOUT)
  }
}
