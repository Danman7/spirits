import { initialState } from 'src/features/duel/slice'
import { DuelState, Player, PlayerCardAction } from 'src/features/duel/types'

export const drawCardFromDeckTransformer = (
  state: DuelState,
  playerId: Player['id'],
) => {
  const { players } = state

  const drawingPlayer = players[playerId]

  if (drawingPlayer.deck.length) {
    const drawnCardId = drawingPlayer.deck.shift()

    if (drawnCardId) {
      drawingPlayer.hand.push(drawnCardId)
    }
  }
}

export const moveCardToBoardTransformer = (
  state: DuelState,
  action: PlayerCardAction,
) => {
  const { cardId: playedCardId, playerId } = action.payload
  const { players } = state

  const playedCard = players[playerId].cards[playedCardId]

  players[playerId].hasPerformedAction = true
  players[playerId].deck = players[playerId].deck.filter(
    (cardId) => cardId !== playedCardId,
  )
  players[playerId].hand = players[playerId].hand.filter(
    (cardId) => cardId !== playedCardId,
  )
  players[playerId].discard = players[playerId].discard.filter(
    (cardId) => cardId !== playedCardId,
  )
  players[playerId].board = [...players[playerId].board, playedCard.id]
}

const endTurnTransformer = (state: DuelState) => {
  state.turn += 1
  state.phase = 'Player Turn'
  state.attackingAgentId = initialState.attackingAgentId

  state.activePlayerId =
    state.playerOrder[0] === state.activePlayerId
      ? state.playerOrder[1]
      : state.playerOrder[0]

  state.playerOrder.forEach((playerId) => {
    const player = state.players[playerId]

    state.players[playerId].hasPerformedAction = false

    if (player.income) {
      state.players[playerId].coins += 1
      state.players[playerId].income -= 1
    }
  })

  drawCardFromDeckTransformer(state, state.activePlayerId)
}

export const initializeEndTurnTransformer = (state: DuelState) => {
  state.phase = 'Resolving end of turn'

  moveToNextAttackerTransformer(state)
}

export const moveToNextAttackerTransformer = (state: DuelState) => {
  const { players, activePlayerId, attackingAgentId } = state

  const activePlayer = players[activePlayerId]

  state.attackingAgentId = activePlayer.board[0] || ''

  if (!state.attackingAgentId) {
    return endTurnTransformer(state)
  }

  const attackingAgentIndex = activePlayer.board.indexOf(attackingAgentId)

  if (attackingAgentIndex === activePlayer.board.length - 1) {
    endTurnTransformer(state)
  } else {
    agentAttackTransformer(state)
    state.attackingAgentId = activePlayer.board[attackingAgentIndex + 1]
  }
}

const agentAttackTransformer = (state: DuelState) => {
  const { players, playerOrder, activePlayerId, attackingAgentId } = state

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

      if (players[opponent.id].cards[defendingCardId].type === 'agent') {
        players[opponent.id].cards[defendingCardId].strength -= 1

        if (players[opponent.id].cards[defendingCardId].strength <= 0) {
          moveCardToDiscardTransformer(state, {
            payload: {
              cardId: defendingCardId,
              playerId: opponent.id,
            },
          })
        }
      }
    } else {
      players[opponent.id].coins -= 1
    }
  }
}

export const moveCardToDiscardTransformer = (
  state: DuelState,
  action: Omit<PlayerCardAction, 'type'>,
) => {
  const { players } = state
  const { playerId, cardId: movedCardId } = action.payload

  const player = players[playerId]

  players[playerId].board = player.board.filter(
    (cardId) => cardId !== movedCardId,
  )
  players[playerId].hand = player.hand.filter(
    (cardId) => cardId !== movedCardId,
  )
  players[playerId].deck = player.deck.filter(
    (cardId) => cardId !== movedCardId,
  )

  players[playerId].discard = [...player.discard, movedCardId]

  if (players[playerId].cards[movedCardId].base.strength) {
    players[playerId].cards[movedCardId].strength =
      players[playerId].cards[movedCardId].base.strength
  }

  players[playerId].income += players[playerId].cards[movedCardId].cost
}
