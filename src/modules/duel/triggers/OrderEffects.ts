import { Effect } from 'src/app'
import {
  getNeighboursIndexes,
  getPlayAllCopiesEffect,
  playCard,
  updateCard,
} from 'src/modules/duel'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/shared/data'

export const PlayAllHammeriteNoviceCopies: Effect = (action, listenerApi) =>
  getPlayAllCopiesEffect(action, listenerApi, 'HammeriteNovice')

export const DamageSelfIfNotNextToHigherPowerHammerite: Effect = (
  action,
  listenerApi,
) => {
  if (playCard.match(action)) {
    const { getState, dispatch } = listenerApi
    const { cardId, playerId } = action.payload
    const { players } = getState().duel
    const { board, cards } = players[playerId]
    const matchedCard = cards[cardId]

    const playerdCardIndex = board.indexOf(cardId)
    const neighbourIndexed = getNeighboursIndexes(playerdCardIndex, board)

    if (
      !neighbourIndexed.some((neighbourIndex) => {
        const card = cards[board[neighbourIndex]]
        const { categories, strength } = card

        return (
          card &&
          categories.includes('Hammerite') &&
          strength > matchedCard.strength
        )
      })
    ) {
      dispatch(
        updateCard({
          cardId,
          playerId,
          update: {
            strength: matchedCard.strength - 1,
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
      const { strength, categories } = cards[boardCardId]

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

export const PlaySelfIfCounterIsZero: Effect = (action, listenerApi) => {
  if (updateCard.match(action)) {
    const { getState, dispatch } = listenerApi
    const { players } = getState().duel
    const { cardId, playerId } = action.payload
    const { cards, board } = players[playerId]
    const { counter } = cards[cardId]

    if ((counter as number) <= 0 && !board.includes(cardId))
      dispatch(playCard({ cardId, playerId, shouldPay: false }))
  }
}
