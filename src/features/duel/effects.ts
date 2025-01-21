import { Effect } from 'src/app/listenerMiddleware'
import { playCard, updateCard } from 'src/features/duel/slice'
import {
  getNeighboursIndexes,
  getPlayAllCopiesEffect,
} from 'src/features/duel/utils'
import { HammeriteNovice } from 'src/shared/CardBases'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/shared/constants'

export const PlayAllHammeriteNoviceCopies: Effect = (action, listenerApi) =>
  getPlayAllCopiesEffect(action, listenerApi, HammeriteNovice)

export const DamageSelfIfNotNextToHigherPowerHammerite: Effect = (
  action,
  listenerApi,
) => {
  if (playCard.match(action)) {
    const { getState, dispatch } = listenerApi
    const { cardId, playerId } = action.payload
    const { players } = getState().duel
    const { board, cards } = players[playerId]

    const playerdCardIndex = board.indexOf(cardId)
    const neighbourIndexed = getNeighboursIndexes(playerdCardIndex, board)

    if (
      !neighbourIndexed.some((neighbourIndex) => {
        const card = cards[board[neighbourIndex]]

        return (
          card &&
          card.categories.includes('Hammerite') &&
          card.strength > cards[cardId].strength
        )
      })
    ) {
      dispatch(
        updateCard({
          cardId,
          playerId,
          update: {
            strength: cards[cardId].strength - 1,
          },
        }),
      )
    }
  }
}

export const BoostAlliedHammeritesWithLowerStrength: Effect = (
  action,
  listenerApi,
) => {
  if (playCard.match(action)) {
    const { getState, dispatch } = listenerApi
    const { cardId: playedCardId, playerId } = action.payload
    const { players } = getState().duel
    const { board, cards } = players[playerId]

    board.forEach((boardCardId) => {
      const { categories, strength } = cards[boardCardId]

      if (
        categories.includes('Hammerite') &&
        boardCardId !== playedCardId &&
        strength < cards[playedCardId].strength
      ) {
        dispatch(
          updateCard({
            cardId: boardCardId,
            playerId,
            update: {
              strength: strength + HAMMERITES_WITH_LOWER_STRENGTH_BOOST,
            },
          }),
        )
      }
    })
  }
}
