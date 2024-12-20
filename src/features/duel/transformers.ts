import { initialState } from 'src/features/duel/slice'
import { DuelState, Player, PlayerCardAction } from 'src/features/duel/types'
import { getOpponentId, moveCardBetweenStacks } from 'src/features/duel/utils'

export const drawCardFromDeckTransformer = (
  state: DuelState,
  playerId: Player['id'],
) => {
  const { players } = state

  const drawingPlayer = players[playerId]

  if (drawingPlayer.deck.length) {
    moveCardBetweenStacks({
      movedCardId: drawingPlayer.deck[0],
      playerId,
      state,
      to: 'hand',
    })
  }
}

export const moveCardToBoardTransformer = (
  state: DuelState,
  action: PlayerCardAction,
) => {
  const { cardId: playedCardId, playerId } = action.payload
  const { players } = state

  moveCardBetweenStacks({
    movedCardId: playedCardId,
    playerId,
    state,
    to: 'board',
  })

  players[playerId].hasPerformedAction = true
}

const endTurnTransformer = (state: DuelState) => {
  const { activePlayerId, players } = state

  state.phase = 'Player Turn'
  state.attackingAgentId = initialState.attackingAgentId

  Object.values(players).forEach(({ id }) => {
    const player = state.players[id]

    state.players[id].hasPerformedAction = false

    if (id !== activePlayerId) {
      state.activePlayerId = id
    }

    if (player.income) {
      state.players[id].coins += 1
      state.players[id].income -= 1
    }
  })

  drawCardFromDeckTransformer(state, state.activePlayerId)
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
    if (state.attackingAgentId) {
      const opponent = players[getOpponentId(players, activePlayerId)]

      if (opponent.board.length) {
        const attackingCardIndex = players[activePlayerId].board.indexOf(
          state.attackingAgentId,
        )
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

    state.attackingAgentId = activePlayer.board[attackingAgentIndex + 1]
  }
}

export const moveCardToDiscardTransformer = (
  state: DuelState,
  action: Omit<PlayerCardAction, 'type'>,
) => {
  const { players } = state
  const { playerId, cardId: movedCardId } = action.payload

  moveCardBetweenStacks({
    movedCardId,
    playerId,
    state,
    to: 'discard',
  })

  const discardedCard = players[playerId].cards[movedCardId]

  if (discardedCard.base.strength) {
    players[playerId].cards[movedCardId].strength = discardedCard.base.strength
  }

  players[playerId].income += discardedCard.cost
}
