import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import { CardEffect } from 'src/features/cards/types'
import { playCard, updateCard } from 'src/features/duel/slice'
import { PlayerCardAction } from 'src/features/duel/types'
import { HammeriteNovice } from 'src/features/cards/CardPrototypes'

export const BrotherSachelmanOnPlayEffect: CardEffect<PlayerCardAction> = (
  action,
  listenerApi,
) => {
  const { cardId, playerId } = action.payload

  const { players } = listenerApi.getState().duel

  const playedCard = players[playerId].cards[cardId]

  players[playerId].board.forEach((cardId) => {
    const cardOnBoard = { ...players[playerId].cards[cardId] }

    if (
      cardOnBoard.kind === 'agent' &&
      cardOnBoard.types.includes('Hammerite') &&
      cardOnBoard.strength < playedCard.strength
    ) {
      listenerApi.dispatch(
        updateCard({
          playerId,
          cardId,
          update: {
            strength: (cardOnBoard.strength +=
              HAMMERITES_WITH_LOWER_STRENGTH_BOOST),
          },
        }),
      )
    }
  })
}

export const HammeriteNoviceOnPlayEffect: CardEffect<PlayerCardAction> = (
  action,
  listenerApi,
) => {
  const { playerId, cardId: playedCardId } = action.payload

  const { players } = listenerApi.getState().duel

  const player = players[playerId]

  const cardsOnBoard = player.board
    .filter((cardId) => cardId !== playedCardId)
    .map((cardId) => player.cards[cardId])

  if (!cardsOnBoard.find((card) => card && card.types.includes('Hammerite'))) {
    return
  }

  player.hand.forEach((cardId) => {
    const cardInHand = { ...player.cards[cardId] }

    if (
      cardInHand.name === HammeriteNovice.name &&
      cardInHand.id !== playedCardId
    ) {
      listenerApi.dispatch(
        playCard({
          playerId,
          cardId,
        }),
      )
    }
  })
}
