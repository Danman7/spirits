import { addAppListener, startAppListening } from 'src/app/listenerMiddleware'
import {
  INITIAL_CARD_DRAW_AMOUNT,
  SHORT_ANIMATION_CYCLE,
} from 'src/features/duel/constants'
import {
  completeRedraw,
  drawCardFromDeck,
  initializeDuel,
  beginPlay,
  startRedraw,
  endTurn,
} from 'src/features/duel/slice'
import { DuelPhase } from 'src/features/duel/types'
import * as CardEffects from 'src/features/cards/CardEffects'
import { isAnyOf } from '@reduxjs/toolkit'

startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.playerOrder.every(
      (playerId) => !currentState.duel.players[playerId].hand.length,
    ) ||
    (currentState.duel.phase === DuelPhase.INITIAL_DRAW &&
      currentState.duel.playerOrder.every(
        (playerId) =>
          currentState.duel.players[playerId].hand.length <
          INITIAL_CARD_DRAW_AMOUNT,
      )),
  effect: async (action, listenerApi) => {
    const { playerOrder } = listenerApi.getState().duel

    await listenerApi.delay(SHORT_ANIMATION_CYCLE)

    if (action.type === drawCardFromDeck.type) {
      listenerApi.dispatch(drawCardFromDeck(action.payload as string))
    } else {
      playerOrder.forEach((playerId) =>
        listenerApi.dispatch(drawCardFromDeck(playerId)),
      )
    }
  },
})

startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.phase === DuelPhase.INITIAL_DRAW &&
    currentState.duel.playerOrder.every(
      (playerId) =>
        currentState.duel.players[playerId].hand.length ===
        INITIAL_CARD_DRAW_AMOUNT,
    ),

  effect: (_, listenerApi) => {
    listenerApi.unsubscribe()

    listenerApi.dispatch(startRedraw())

    const { players, playerOrder } = listenerApi.getState().duel

    playerOrder.forEach((playerId) => {
      const player = players[playerId]

      if (player.isCPU && !player.isReady) {
        listenerApi.dispatch(completeRedraw(player.id))
      }
    })
  },
})

startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.phase === DuelPhase.REDRAW &&
    currentState.duel.playerOrder.every(
      (playerId) => currentState.duel.players[playerId].isReady,
    ),
  effect: (_, listenerApi) => {
    listenerApi.unsubscribe()

    listenerApi.dispatch(beginPlay())
  },
})

startAppListening({
  actionCreator: initializeDuel,
  effect: (action, listenerApi) => {
    action.payload.players.forEach(({ cards }) =>
      Object.keys(cards).forEach((cardId) => {
        const { trigger } = cards[cardId]

        if (trigger) {
          const { type, effect } = trigger

          listenerApi.dispatch(
            addAppListener({
              type,
              effect: CardEffects[effect],
            }),
          )
        }
      }),
    )
  },
})

startAppListening({
  matcher: isAnyOf(endTurn, beginPlay),
  effect: (_, listenerApi) => {
    const { players, playerOrder } = listenerApi.getState().duel

    const activePlayerId = players[playerOrder[0]].isActive
      ? players[playerOrder[0]].id
      : players[playerOrder[1]].id

    listenerApi.dispatch(drawCardFromDeck(activePlayerId))
  },
})
