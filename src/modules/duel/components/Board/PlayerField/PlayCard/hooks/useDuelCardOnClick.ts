import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { CardStack } from 'src/modules/duel/state'

import { useUser } from 'src/shared/modules/user'

export const useDuelCardOnClick = (
  cardId: string,
  playerId: string,
  stack: CardStack,
): (() => void) | undefined => {
  const {
    state: {
      cards,
      players,
      phase,
      playerOrder: [activePlayerId],
      targeting: { validTargets },
    },
    dispatch,
  } = useDuel()

  const { state: user } = useUser()
  const { id: userId } = user

  const { hasPerformedAction, coins } = players[playerId]
  const { cost } = cards[cardId]

  if (phase === 'Select Target' && validTargets.includes(cardId)) {
    return () => dispatch({ type: 'SELECT_TARGET', cardId })
  }

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
