import { useEffect } from 'react'
import { CardStack, useDuel } from 'src/modules/duel'
import { Agent } from 'src/shared/types'
import { useUser } from 'src/shared/user'

export const useCard = (playerId: string, cardId: string) => {
  const {
    state: { players },
  } = useDuel()

  return players[playerId].cards[cardId]
}

export const useCardStack = (playerId: string, cardId: string): CardStack => {
  const {
    state: { players },
  } = useDuel()

  const { hand, deck, board } = players[playerId]

  if (hand.includes(cardId)) return 'hand'
  if (deck.includes(cardId)) return 'deck'
  if (board.includes(cardId)) return 'board'

  return 'discard'
}

export const useIsAttacking = (cardId: string) => {
  const {
    state: { attackingQueue },
  } = useDuel()

  return cardId === attackingQueue[0]?.attackerId
}

export const useDuelCardOnClick = (
  cardId: string,
  playerId: string,
  stack: CardStack,
) => {
  const {
    state: {
      players,
      phase,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  const { state: user } = useUser()
  const { id: userId } = user

  const { hasPerformedAction, coins, cards } = players[playerId]
  const { cost } = cards[cardId]

  if (stack === 'hand' && !hasPerformedAction) {
    if (
      phase === 'Player Turn' &&
      playerId === userId &&
      playerId === activePlayerId &&
      cost <= coins
    ) {
      return () =>
        dispatch({ type: 'PLAY_CARD', cardId, playerId, shouldPay: true })
    }

    if (phase === 'Redrawing') {
      return () => {
        dispatch({ type: 'REDRAW_CARD', cardId, playerId })
      }
    }
  }

  return undefined
}

export const useDefeatHandler = (
  cardId: string,
  playerId: string,
  stack: CardStack,
) => {
  const {
    state: { players },
    dispatch,
  } = useDuel()

  const { cards, discard } = players[playerId]
  const card = cards[cardId] as Agent

  useEffect(() => {
    if (stack !== 'board' || card.strength > 0 || discard.includes(cardId))
      return

    dispatch({ type: 'DISCARD_CARD', cardId, playerId })
  }, [cardId, playerId, stack, card.strength, card.type, discard, dispatch])
}
