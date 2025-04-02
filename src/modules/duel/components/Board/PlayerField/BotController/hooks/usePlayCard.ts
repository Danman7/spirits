import { useEffect } from 'react'

import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { getPlayableCardIds } from 'src/modules/duel/duel.utils'

import { getRandomArrayItem } from 'src/shared/shared.utils'

export const usePlayCard = (playerId: string) => {
  const {
    state: {
      playerOrder: [activePlayerId],
      players,
      phase,
      cards,
    },
    dispatch,
  } = useDuel()

  const player = players[playerId]
  const { hasPerformedAction } = player
  const isActive = playerId === activePlayerId

  useEffect(() => {
    if (phase !== 'Player Turn' || !isActive || hasPerformedAction) return

    const playableCardIds = getPlayableCardIds(player, cards)

    if (playableCardIds.length) {
      const cardId = getRandomArrayItem(playableCardIds)

      dispatch({ type: 'PLAY_CARD', cardId, playerId, shouldPay: true })
    } else {
      dispatch({ type: 'RESOLVE_TURN' })
    }
  }, [playerId, hasPerformedAction, isActive, phase, player, cards, dispatch])
}
