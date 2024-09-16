import { Action, ListenerEffect } from '@reduxjs/toolkit'
import { LONG_ANIMATION_CYCLE, SHORT_ANIMATION_CYCLE } from 'src/Game/constants'
import { getPlayableCardIds } from 'src/Game/GameUtils'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { AppDispatch, GamePhase, RootState } from 'src/shared/redux/StateTypes'
import { getRandomArrayItem } from 'src/shared/utils/utils'

// Handle computer playing turn
export const computerTurnListener: ListenerEffect<
  Action,
  RootState,
  AppDispatch
> = (_, listenerApi) => {
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
