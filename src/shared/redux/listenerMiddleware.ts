import { addListener, createListenerMiddleware } from '@reduxjs/toolkit'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/Game/constants'
import { computerTurnListener } from 'src/shared/redux/listeners/computerPlayer'
import {
  completeRedrawListener,
  drawCardListener,
  startRedrawListener
} from 'src/shared/redux/listeners/gameFlow'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { AppDispatch, GamePhase, RootState } from 'src/shared/redux/StateTypes'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>()

export const addAppListener = addListener.withTypes<RootState, AppDispatch>()

// GAME FLOW
startAppListening({
  predicate: (_, currentState) =>
    currentState.game.playerOrder.every(
      playerId => !currentState.game.players[playerId].hand.length
    ) ||
    (currentState.game.phase === GamePhase.INITIAL_DRAW &&
      currentState.game.playerOrder.every(
        playerId =>
          currentState.game.players[playerId].hand.length <
          INITIAL_CARD_DRAW_AMOUNT
      )),
  effect: drawCardListener
})

startAppListening({
  predicate: (_, currentState) =>
    currentState.game.phase === GamePhase.INITIAL_DRAW &&
    currentState.game.playerOrder.every(
      playerId =>
        currentState.game.players[playerId].hand.length ===
        INITIAL_CARD_DRAW_AMOUNT
    ),

  effect: startRedrawListener
})

startAppListening({
  predicate: (_, currentState) =>
    currentState.game.phase === GamePhase.REDRAW &&
    currentState.game.playerOrder.every(
      playerId => currentState.game.players[playerId].isReady
    ),
  effect: completeRedrawListener
})

// CPU PLAYER
startAppListening({
  actionCreator: GameActions.endTurn,
  effect: computerTurnListener
})
