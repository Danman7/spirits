import { isAnyOf } from '@reduxjs/toolkit'

import { addAppListener, startAppListening } from 'src/app/listenerMiddleware'
import { MEDIUM_ANIMATION_CYCLE } from 'src/features/duel/constants'
import {
  beginPlay,
  endTurn,
  initializeEndTurn,
  moveToNextAttacker,
  agentAttacksAgent,
  agentAttacksPlayer,
  updateCard,
  moveCardToDiscard,
} from 'src/features/duel/slice'
import * as CardEffects from 'src/features/cards/CardEffects'
import * as CardEffectPredicates from 'src/features/cards/CardEffectPredicates'
import { Player } from 'src/features/duel/types'

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

// Manage agents being defeated
startAppListening({
  matcher: isAnyOf(updateCard, agentAttacksAgent),
  effect: async (_, listenerApi) => {
    const { players, playerOrder } = listenerApi.getState().duel

    playerOrder.forEach((playerId) => {
      Object.values(players[playerId].cards).forEach(
        ({ strength, id: cardId }) => {
          if (strength <= 0) {
            listenerApi.dispatch(
              moveCardToDiscard({
                cardId,
                playerId,
              }),
            )
          }
        },
      )
    })
  },
})
