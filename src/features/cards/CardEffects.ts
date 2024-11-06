import { HammeriteNovice } from 'src/features/cards/CardPrototypes'
import { HAMMERITES_WITH_LOWER_STRENGTH_BOOST } from 'src/features/cards/constants'
import { Agent, CardEffect } from 'src/features/cards/types'
import { copyDuelCard } from 'src/features/cards/utils'
import {
  addNewCards,
  moveCardToBoard,
  updateAgent,
} from 'src/features/duel/slice'
import { PlayerCardAction, PlayerCards } from 'src/features/duel/types'

export const BrotherSachelmanOnPlayEffect: CardEffect<PlayerCardAction> = (
  action,
  listenerApi,
) => {
  const { cardId, playerId } = action.payload

  const { players } = listenerApi.getState().duel

  const playedCard = players[playerId].cards[cardId] as Agent

  players[playerId].board.forEach((cardId) => {
    const cardOnBoard = { ...players[playerId].cards[cardId] }

    if (
      cardOnBoard.kind === 'agent' &&
      cardOnBoard.types.includes('Hammerite') &&
      cardOnBoard.strength < playedCard.strength
    ) {
      listenerApi.dispatch(
        updateAgent({
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
        moveCardToBoard({
          playerId,
          cardId,
        }),
      )
    }
  })
}

export const BookOfAshEffect: CardEffect<PlayerCardAction> = (
  action,
  listenerApi,
) => {
  const { playerId } = action.payload

  const { players } = listenerApi.getState().duel

  const player = players[playerId]

  const topUndeadCardInDiscard =
    player.cards[
      player.discard.findLast((cardId) =>
        player.cards[cardId].types.includes('Undead'),
      ) || ''
    ]

  if (topUndeadCardInDiscard) {
    const undead1 = copyDuelCard(topUndeadCardInDiscard)
    const undead2 = copyDuelCard(topUndeadCardInDiscard)

    const cards: PlayerCards = {
      [undead1.id]: undead1,
      [undead2.id]: undead2,
    }

    listenerApi.dispatch(
      addNewCards({
        playerId,
        cards,
      }),
    )

    listenerApi.dispatch(moveCardToBoard({ cardId: undead1.id, playerId }))
    listenerApi.dispatch(moveCardToBoard({ cardId: undead2.id, playerId }))
  }
}
