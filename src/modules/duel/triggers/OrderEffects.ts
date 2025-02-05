import { Effect } from 'src/app'
import {
  getNeighboursIndexes,
  getPlayAllCopiesEffect,
  playCard,
  updateAgent,
} from 'src/modules/duel'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/shared/data'
import { Agent } from 'src/shared/types'

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
    const matchedCard = cards[cardId] as Agent

    const playerdCardIndex = board.indexOf(cardId)
    const neighbourIndexed = getNeighboursIndexes(playerdCardIndex, board)

    if (
      !neighbourIndexed.some((neighbourIndex) => {
        const card = cards[board[neighbourIndex]] as Agent
        const { categories, strength } = card

        return (
          card &&
          categories.includes('Hammerite') &&
          strength > matchedCard.strength
        )
      })
    ) {
      dispatch(
        updateAgent({
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
      const { strength, categories } = cards[boardCardId] as Agent

      if (
        categories.includes('Hammerite') &&
        boardCardId !== playedCardId &&
        strength < (cards[playedCardId] as Agent).strength
      ) {
        dispatch(
          updateAgent({
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
  if (updateAgent.match(action)) {
    const { getState, dispatch } = listenerApi
    const { players } = getState().duel
    const { cardId, playerId } = action.payload
    const { cards, board } = players[playerId]
    const { counter } = cards[cardId] as Agent

    if ((counter as number) <= 0 && !board.includes(cardId))
      dispatch(playCard({ cardId, playerId, shouldPay: false }))
  }
}
