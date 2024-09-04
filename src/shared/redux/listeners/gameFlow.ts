import {
  INITIAL_CARD_DRAW_AMOUNT,
  SHORT_ANIMATION_CYCLE
} from 'src/Game/constants'
import { startAppListening } from 'src/shared/redux/middleware'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { GamePhase, PlayerIndex } from 'src/shared/redux/StateTypes'

// Handle initial draw
startAppListening({
  actionCreator: GameActions.initializeGame,
  effect: async (_, listenerApi) => {
    const { players } = listenerApi.getState().game

    if (players.every(({ hand }) => !hand.length)) {
      players.forEach((_, playerIndex) =>
        setTimeout(() => {
          listenerApi.dispatch(
            GameActions.drawCardFromDeck(playerIndex as PlayerIndex)
          )
        }, SHORT_ANIMATION_CYCLE)
      )
    }
  }
})

startAppListening({
  actionCreator: GameActions.drawCardFromDeck,
  effect: async (action, listenerApi) => {
    const playerIndex = action.payload
    const { players, phase } = listenerApi.getState().game

    const player = players[playerIndex]

    if (
      phase === GamePhase.INITIAL_DRAW &&
      player.hand.length < INITIAL_CARD_DRAW_AMOUNT
    ) {
      setTimeout(() => {
        listenerApi.dispatch(GameActions.drawCardFromDeck(playerIndex))
      }, SHORT_ANIMATION_CYCLE)
    }

    if (
      phase === GamePhase.INITIAL_DRAW &&
      players.every(({ hand }) => hand.length === INITIAL_CARD_DRAW_AMOUNT)
    ) {
      listenerApi.dispatch(GameActions.startRedraw())
    }
  }
})

// Handle starting game if both players are ready with redraw
startAppListening({
  actionCreator: GameActions.completeRedraw,
  effect: async (_, listenerApi) => {
    const { players, phase } = listenerApi.getState().game

    if (phase === GamePhase.REDRAW && players.every(({ isReady }) => isReady)) {
      listenerApi.dispatch(GameActions.startGame())
    }
  }
})
