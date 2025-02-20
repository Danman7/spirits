import { useEffect, useMemo } from 'react'
import { CardStack, useDuel } from 'src/modules/duel'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
import { useUser } from 'src/shared/user'

interface CardProps {
  cardId: string
  playerId: string
}

interface UseDuelCardStateProps extends CardProps {
  isOnTop: boolean
}

export const useDuelCardState = ({
  cardId,
  isOnTop,
  playerId,
}: UseDuelCardStateProps) => {
  const { state: user } = useUser()
  const { id: userId } = user

  const {
    state: {
      players,
      attackingQueue,
      playerOrder: [activePlayerId],
    },
  } = useDuel()

  const { cards, hand, deck, board } = players[playerId]
  const card = cards[cardId]

  const stack: CardStack = useMemo(() => {
    if (hand.includes(cardId)) return 'hand'
    if (deck.includes(cardId)) return 'deck'
    if (board.includes(cardId)) return 'board'

    return 'discard'
  }, [players[playerId]])

  return {
    card,
    stack,
    isFaceDown: isOnTop
      ? ['deck', 'discard', 'hand'].includes(stack)
      : ['deck', 'discard'].includes(stack),
    isSmall: ['deck', 'discard', 'board'].includes(stack),
    isUserActive: playerId === userId && playerId === activePlayerId,
    isAttacking: cardId === attackingQueue[0]?.attackerId,
  }
}

interface UseDuelCardActionsProps extends CardProps {
  isUserActive: boolean
  cost: number
  stack: CardStack
}

export const useDuelCardActions = ({
  cardId,
  cost,
  isUserActive,
  playerId,
  stack,
}: UseDuelCardActionsProps) => {
  const {
    state: { players, phase },
    dispatch,
  } = useDuel()

  const { hasPerformedAction, coins } = players[playerId]

  if (stack === 'hand' && !hasPerformedAction) {
    if (phase === 'Player Turn' && isUserActive && cost <= coins) {
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

export const useAttackHandler = (
  cardId: string,
  playerId: string,
  isAttacking: boolean,
) => {
  const {
    state: { attackingQueue, playerOrder },
    dispatch,
  } = useDuel()

  useEffect(() => {
    if (!isAttacking) return

    const [activePlayerId, inactivePlayerId] = playerOrder

    const defendingPlayerId =
      playerId === activePlayerId ? inactivePlayerId : activePlayerId
    if (!defendingPlayerId) return

    dispatch({
      type: 'AGENT_ATTACK',
      defendingAgentId: attackingQueue.find(
        ({ attackerId }) => attackerId === cardId,
      )?.defenderId,
      defendingPlayerId,
    })

    setTimeout(() => {
      dispatch({ type: 'MOVE_TO_NEXT_ATTACKER' })
    }, ACTION_WAIT_TIMEOUT)
  }, [isAttacking])
}

export const useDefeatHandler = (
  cardId: string,
  playerId: string,
  stack: CardStack,
  strength: number,
) => {
  const { dispatch } = useDuel()

  useEffect(() => {
    if (stack !== 'board' || strength > 0) return

    dispatch({ type: 'DISCARD_CARD', cardId, playerId })
  }, [stack, strength])
}
