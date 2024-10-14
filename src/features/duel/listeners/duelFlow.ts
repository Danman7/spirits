import { isAnyOf } from '@reduxjs/toolkit'

import { addAppListener, startAppListening } from 'src/app/listenerMiddleware'
import {
  INITIAL_CARD_DRAW_AMOUNT,
  MEDIUM_ANIMATION_CYCLE,
} from 'src/features/duel/constants'
import {
  completeRedraw,
  drawCardFromDeck,
  beginPlay,
  startRedraw,
  endTurn,
  initializeEndTurn,
  moveToNextAttacker,
  agentAttacksAgent,
  agentAttacksPlayer,
} from 'src/features/duel/slice'
import * as CardEffects from 'src/features/cards/CardEffects'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import { Player } from 'src/features/duel/types'

// Initial card draw
startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.playerOrder.every(
      (playerId) => !currentState.duel.players[playerId].hand.length,
    ) ||
    (currentState.duel.phase === 'Initial Draw' &&
      currentState.duel.playerOrder.every(
        (playerId) =>
          currentState.duel.players[playerId].hand.length <
          INITIAL_CARD_DRAW_AMOUNT,
      )),
  effect: async (action, listenerApi) => {
    const { playerOrder } = listenerApi.getState().duel

    await listenerApi.delay(MEDIUM_ANIMATION_CYCLE)

    if (action.type === drawCardFromDeck.type) {
      listenerApi.dispatch(drawCardFromDeck(action.payload as string))
    } else {
      playerOrder.forEach((playerId) =>
        listenerApi.dispatch(drawCardFromDeck(playerId)),
      )
    }
  },
})

// Stop initial draw and trigger redraw phase
startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.phase === 'Initial Draw' &&
    currentState.duel.playerOrder.every(
      (playerId) =>
        currentState.duel.players[playerId].hand.length ===
        INITIAL_CARD_DRAW_AMOUNT,
    ),

  effect: async (_, listenerApi) => {
    await listenerApi.delay(MEDIUM_ANIMATION_CYCLE)

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

// If both plears are ready with redraw begin play
startAppListening({
  predicate: (_, currentState) =>
    currentState.duel.phase === 'Redrawing Phase' &&
    currentState.duel.playerOrder.every(
      (playerId) => currentState.duel.players[playerId].isReady,
    ),
  effect: (_, listenerApi) => {
    listenerApi.dispatch(beginPlay())
  },
})

// Add listeners for card effects
startAppListening({
  actionCreator: beginPlay,
  effect: (_, listenerApi) => {
    const { players } = listenerApi.getState().duel

    const addedListeners: string[] = []

    Object.values(players).forEach(({ cards }) =>
      Object.keys(cards).forEach((cardId) => {
        const { trigger, name } = cards[cardId]

        if (trigger && !addedListeners.includes(name)) {
          const { predicate, effect } = trigger

          listenerApi.dispatch(
            addAppListener({
              predicate: CardEffectPredicates[predicate],
              effect: CardEffects[effect],
            }),
          )

          addedListeners.push(name)
        }
      }),
    )
  },
})

// Draw card on round begin
startAppListening({
  matcher: isAnyOf(endTurn, beginPlay),
  effect: async (_, listenerApi) => {
    await listenerApi.delay(MEDIUM_ANIMATION_CYCLE)

    const { activePlayerId } = listenerApi.getState().duel

    listenerApi.dispatch(drawCardFromDeck(activePlayerId))
  },
})

// Manage attacking
startAppListening({
  matcher: isAnyOf(initializeEndTurn, moveToNextAttacker),
  effect: async (_, listenerApi) => {
    const { activePlayerId, attackingAgentId, playerOrder, players } =
      listenerApi.getState().duel

    if (attackingAgentId) {
      const opponent: Player =
        players[playerOrder[0]].id === activePlayerId
          ? players[playerOrder[1]]
          : players[playerOrder[0]]

      if (opponent.board.length) {
        const attackingCardIndex =
          players[activePlayerId].board.indexOf(attackingAgentId)
        const defendingCardId =
          opponent.board[attackingCardIndex] ||
          opponent.board[opponent.board.length - 1]

        listenerApi.dispatch(
          agentAttacksAgent({
            attackingCardId: attackingAgentId,
            attackinPlayerId: activePlayerId,
            defendingPlayerId: opponent.id,
            defendingCardId,
          }),
        )
      } else {
        listenerApi.dispatch(
          agentAttacksPlayer({
            attackingCardId: attackingAgentId,
            attackinPlayerId: activePlayerId,
            defendingPlayerId: opponent.id,
          }),
        )
      }
    }

    await listenerApi.delay(MEDIUM_ANIMATION_CYCLE)

    const activePlayer = players[activePlayerId]

    const attackingAgentIndex = activePlayer.board.indexOf(attackingAgentId)

    if (attackingAgentIndex === activePlayer.board.length - 1) {
      listenerApi.dispatch(endTurn())
    } else {
      listenerApi.dispatch(
        moveToNextAttacker(activePlayer.board[attackingAgentIndex + 1]),
      )
    }
  },
})
