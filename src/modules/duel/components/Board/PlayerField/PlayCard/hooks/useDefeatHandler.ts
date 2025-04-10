import { useEffect } from 'react'

import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { CardStack } from 'src/modules/duel/state'

import type { Agent } from 'src/shared/modules/cards'

export const useDefeatHandler = (
  cardId: string,
  playerId: string,
  stack: CardStack,
) => {
  const {
    state: { players, cards },
    dispatch,
  } = useDuel()

  const { discard } = players[playerId]
  const card = cards[cardId] as Agent

  useEffect(() => {
    if (stack !== 'board' || card.strength > 0 || discard.includes(cardId))
      return

    dispatch({ type: 'DISCARD_CARD', cardId })
  }, [cardId, playerId, stack, card.strength, card.type, discard, dispatch])
}
