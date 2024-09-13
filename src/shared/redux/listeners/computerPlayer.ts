import { LONG_ANIMATION_CYCLE, SHORT_ANIMATION_CYCLE } from 'src/Game/constants'
import { getPlayableCardIds } from 'src/Game/GameUtils'
import { startAppListening } from 'src/shared/redux/middleware'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { GamePhase } from 'src/shared/redux/StateTypes'
import { getRandomArrayItem } from 'src/shared/utils/utils'

// Handle CPU skipping redraw
startAppListening({
  actionCreator: GameActions.startRedraw,
  effect: async (_, listenerApi) => {
    const { players, playerOrder, phase } = listenerApi.getState().game

    playerOrder.forEach(playerId => {
      const player = players[playerId]

      if (player.isCPU && phase === GamePhase.REDRAW && !player.isReady) {
        listenerApi.dispatch(GameActions.completeRedraw(player.id))
      }
    })
  }
})

// Handle computer playing turn
startAppListening({
  actionCreator: GameActions.endTurn,
  effect: async (_, listenerApi) => {
    const { players, playerOrder, phase } = listenerApi.getState().game

    playerOrder.forEach(playerId => {
      const player = players[playerId]
      const { cards, isCPU, isActive } = player

      if (isCPU && isActive && phase === GamePhase.PLAYER_TURN) {
        // Play random card for now
        const playableCardIds = getPlayableCardIds(player)

        if (playableCardIds.length) {
          const randomCardId = getRandomArrayItem(playableCardIds)

          setTimeout(() => {
            listenerApi.dispatch(
              GameActions.playCardFromHand({
                card: cards[randomCardId],
                playerId
              })
            )
          }, LONG_ANIMATION_CYCLE + SHORT_ANIMATION_CYCLE)

          setTimeout(() => {
            listenerApi.dispatch(GameActions.endTurn())
          }, LONG_ANIMATION_CYCLE * 2)
        }
      }
    })
  }
})
