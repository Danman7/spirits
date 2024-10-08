import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import { CardEffect } from 'src/features/cards/types'
import { playCardFromHand, updateCard } from 'src/features/duel/slice'
import { PlayCardFromHandAction } from 'src/features/duel/types'
import { HammeriteNovice } from './CardPrototypes'

export const boostHammeritesWithLessStrength: CardEffect<
  PlayCardFromHandAction
> = (action, listenerApi) => {
  const { cardId, playerId } = action.payload

  const { players } = listenerApi.getState().duel

  const playedCard = players[playerId].cards[cardId]

  players[playerId].board.forEach((cardId) => {
    const cardOnBoard = { ...players[playerId].cards[cardId] }

    if (
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

export const playAllCopiesOfHammeriteNovice: CardEffect<
  PlayCardFromHandAction
> = (action, listenerApi) => {
  const { playerId, cardId: playedCardId } = action.payload

  const { players } = listenerApi.getState().duel

  players[playerId].hand.forEach((cardId) => {
    const cardInHand = { ...players[playerId].cards[cardId] }

    if (
      cardInHand.name === HammeriteNovice.name &&
      cardInHand.id !== playedCardId
    ) {
      listenerApi.dispatch(
        playCardFromHand({
          playerId,
          cardId,
        }),
      )
    }
  })
}
