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
