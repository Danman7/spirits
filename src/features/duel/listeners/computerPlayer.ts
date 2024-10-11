import { LONG_ANIMATION_CYCLE } from 'src/features/duel/constants'
import { getPlayableCardIds } from 'src/features/duel/utils'

import { getRandomArrayItem } from 'src/shared/utils'
import { endTurn, playCardFromHand } from 'src/features/duel/slice'
import { startAppListening } from 'src/app/listenerMiddleware'

// Handle computer playing turn
startAppListening({
  actionCreator: endTurn,
  effect: (_, listenerApi) => {
    const { players, playerOrder, phase, activePlayerId } =
      listenerApi.getState().duel

    playerOrder.forEach((playerId) => {
      const player = players[playerId]
      const { isCPU } = player

      const isActive = player.id === activePlayerId

      if (isCPU && isActive && phase === 'Player Turn') {
        // Play random card for now
        const playableCardIds = getPlayableCardIds(player)

        if (playableCardIds.length) {
          const cardId = getRandomArrayItem(playableCardIds)

          setTimeout(() => {
            listenerApi.dispatch(
              playCardFromHand({
                cardId,
                playerId,
              }),
            )
          }, LONG_ANIMATION_CYCLE * 1.5)

          setTimeout(() => {
            listenerApi.dispatch(endTurn())
          }, LONG_ANIMATION_CYCLE * 2.5)
        }
      }
    })
  },
})
