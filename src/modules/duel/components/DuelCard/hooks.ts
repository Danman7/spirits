import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import {
  agentAttack,
  CardStack,
  completeRedraw,
  discardCard,
  drawACardFromDeck,
  getActivePlayerId,
  getAttackingAgentId,
  getattackingQueue,
  getOppositePlayerId,
  getPhase,
  getPlayers,
  moveToNextAttackingAgent,
  playCard,
  putACardAtBottomOfDeck,
} from 'src/modules/duel'
import { getUserId } from 'src/modules/user'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'

interface CardProps {
  cardId: string
  playerId: string
  stack: CardStack
}

interface UseDuelCardStateProps extends CardProps {
  isOnTop: boolean
}

export const useDuelCardState = ({
  cardId,
  isOnTop,
  playerId,
  stack,
}: UseDuelCardStateProps) => {
  const players = useAppSelector(getPlayers)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const userId = useAppSelector(getUserId)

  const { cards } = players[playerId]
  const card = cards[cardId]

  return {
    card,
    isFaceDown: isOnTop
      ? ['deck', 'discard', 'hand'].includes(stack)
      : ['deck', 'discard'].includes(stack),
    isSmall: ['deck', 'discard', 'board'].includes(stack),
    isUserActive: playerId === userId && playerId === activePlayerId,
    isAttacking: cardId === attackingAgentId,
  }
}

interface UseDuelCardActionsProps extends CardProps {
  isUserActive: boolean
  cost: number
}

export const useDuelCardActions = ({
  cardId,
  cost,
  isUserActive,
  playerId,
  stack,
}: UseDuelCardActionsProps) => {
  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)
  const players = useAppSelector(getPlayers)
  const { hasPerformedAction, coins } = players[playerId]

  if (stack === 'hand' && !hasPerformedAction) {
    if (phase === 'Player Turn' && isUserActive && cost <= coins) {
      return () => dispatch(playCard({ cardId, playerId, shouldPay: true }))
    }

    if (phase === 'Redrawing') {
      return () => {
        dispatch(putACardAtBottomOfDeck({ cardId, playerId }))
        dispatch(drawACardFromDeck({ playerId }))
        dispatch(completeRedraw({ playerId }))
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
  const dispatch = useAppDispatch()
  const attackingQueue = useAppSelector(getattackingQueue)
  const players = useAppSelector(getPlayers)

  useEffect(() => {
    if (!isAttacking) return

    const defendingPlayerId = getOppositePlayerId(players, playerId)
    if (!defendingPlayerId) return

    dispatch(
      agentAttack({
        defendingAgentId: attackingQueue.find(
          ({ attackerId }) => attackerId === cardId,
        )?.defenderId,
        defendingPlayerId,
      }),
    )

    setTimeout(() => {
      dispatch(moveToNextAttackingAgent())
    }, ACTION_WAIT_TIMEOUT)
  }, [isAttacking])
}

export const useDefeatHandler = (
  cardId: string,
  playerId: string,
  stack: CardStack,
  strength: number,
) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (stack !== 'board' || strength > 0) return

    setTimeout(() => {
      dispatch(discardCard({ cardId, playerId }))
    }, ACTION_WAIT_TIMEOUT)
  }, [stack, strength])
}
