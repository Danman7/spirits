import { startAppListening } from 'src/app/listenerMiddleware'
import {
  INITIAL_CARD_DRAW_AMOUNT,
  SHORT_ANIMATION_CYCLE
} from 'src/features/duel/constants'
import {
  completeRedraw,
  drawCardFromDeck,
  startGame,
  startRedraw
} from 'src/features/duel/slice'
import { DuelPhase } from 'src/features/duel/types'

// DUEL FLOW
startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.playerOrder.every(
      playerId => !currentState.duel.players[playerId].hand.length
    ) ||
    (currentState.duel.phase === DuelPhase.INITIAL_DRAW &&
      currentState.duel.playerOrder.every(
        playerId =>
          currentState.duel.players[playerId].hand.length <
          INITIAL_CARD_DRAW_AMOUNT
      )),
  effect: async (action, listenerApi) => {
    const { playerOrder } = listenerApi.getState().duel

    await listenerApi.delay(SHORT_ANIMATION_CYCLE)

    if (action.type === drawCardFromDeck.type) {
      listenerApi.dispatch(drawCardFromDeck(action.payload as string))
    } else {
      playerOrder.forEach(playerId =>
        listenerApi.dispatch(drawCardFromDeck(playerId))
      )
    }
  }
})

startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.phase === DuelPhase.INITIAL_DRAW &&
    currentState.duel.playerOrder.every(
      playerId =>
        currentState.duel.players[playerId].hand.length ===
        INITIAL_CARD_DRAW_AMOUNT
    ),

  effect: (_, listenerApi) => {
    listenerApi.unsubscribe()

    listenerApi.dispatch(startRedraw())

    const { players, playerOrder } = listenerApi.getState().duel

    playerOrder.forEach(playerId => {
      const player = players[playerId]

      if (player.isCPU && !player.isReady) {
        listenerApi.dispatch(completeRedraw(player.id))
      }
    })
  }
})

startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.phase === DuelPhase.REDRAW &&
    currentState.duel.playerOrder.every(
      playerId => currentState.duel.players[playerId].isReady
    ),
  effect: (_, listenerApi) => {
    listenerApi.unsubscribe()

    listenerApi.dispatch(startGame())
  }
})
