import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import { CardEffect } from 'src/features/cards/types'
import { updateCard } from 'src/features/duel/slice'
import { PlayCardFromHandAction } from 'src/features/duel/types'

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
