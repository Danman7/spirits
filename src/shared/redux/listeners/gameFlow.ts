import {
  INITIAL_CARD_DRAW_AMOUNT,
  SHORT_ANIMATION_CYCLE
} from 'src/Game/constants'
import { startAppListening } from 'src/shared/redux/middleware'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { GamePhase } from 'src/shared/redux/StateTypes'

// Handle initial draw
startAppListening({
  actionCreator: GameActions.initializeGame,
  effect: async (_, listenerApi) => {
    const { players, playerOrder } = listenerApi.getState().game

    if (playerOrder.every(playerId => !players[playerId].hand.length)) {
      playerOrder.forEach(playerId =>
        setTimeout(() => {
          listenerApi.dispatch(GameActions.drawCardFromDeck(playerId))
        }, SHORT_ANIMATION_CYCLE)
      )
    }
  }
})

startAppListening({
  actionCreator: GameActions.drawCardFromDeck,
  effect: async (action, listenerApi) => {
    const playerId = action.payload
    const { players, phase, playerOrder } = listenerApi.getState().game

    const player = players[playerId]

    if (
      phase === GamePhase.INITIAL_DRAW &&
      player.hand.length < INITIAL_CARD_DRAW_AMOUNT
    ) {
      setTimeout(() => {
        listenerApi.dispatch(GameActions.drawCardFromDeck(playerId))
      }, SHORT_ANIMATION_CYCLE)
    }

    if (
      phase === GamePhase.INITIAL_DRAW &&
      playerOrder.every(
        playerId => players[playerId].hand.length === INITIAL_CARD_DRAW_AMOUNT
      )
    ) {
      listenerApi.dispatch(GameActions.startRedraw())
    }
  }
})

// Handle starting game if both players are ready with redraw
startAppListening({
  actionCreator: GameActions.completeRedraw,
  effect: async (_, listenerApi) => {
    const { players, phase, playerOrder } = listenerApi.getState().game

    if (
      phase === GamePhase.REDRAW &&
      playerOrder.every(playerId => players[playerId].isReady)
    ) {
      listenerApi.dispatch(GameActions.startGame())
    }
  }
})
