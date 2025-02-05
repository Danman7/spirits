import { FC, useEffect, useMemo } from 'react'
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
import { Card } from 'src/shared/components'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'

interface PlayCardProps {
  cardId: string
  playerId: string
  stack: CardStack
  isOnTop?: boolean
}

export const PlayCard: FC<PlayCardProps> = ({
  cardId,
  playerId,
  stack,
  isOnTop = false,
}) => {
  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)
  const players = useAppSelector(getPlayers)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const attackingQueue = useAppSelector(getattackingQueue)
  const userId = useAppSelector(getUserId)

  const { hasPerformedAction, coins, cards } = players[playerId]
  const card = cards[cardId]
  const { type, cost } = card
  const strength = type === 'agent' ? card.strength : 0

  const isFaceDown = isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)
  const isSmall = ['deck', 'discard', 'board'].includes(stack)
  const isUserActive = playerId === userId && playerId === activePlayerId
  const isAttacking = cardId === attackingAgentId

  const onClick = useMemo(() => {
    if (stack === 'hand' && !hasPerformedAction && !isOnTop) {
      if (phase === 'Player Turn' && isUserActive && cost <= coins) {
        return () => {
          dispatch(playCard({ cardId, playerId, shouldPay: true }))
        }
      }

      if (phase === 'Redrawing') {
        return () => {
          dispatch(
            putACardAtBottomOfDeck({
              cardId: cardId,
              playerId,
            }),
          )
          dispatch(drawACardFromDeck({ playerId }))
          dispatch(completeRedraw({ playerId }))
        }
      }
    }

    return undefined
  }, [hasPerformedAction, phase, stack])

  // Attack
  useEffect(() => {
    const defendingPlayerId = getOppositePlayerId(players, playerId)

    if (isAttacking && defendingPlayerId) {
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
    }
  }, [isAttacking])

  // Discard on defeat
  useEffect(() => {
    if (stack === 'board' && strength <= 0) {
      setTimeout(() => {
        dispatch(discardCard({ cardId, playerId }))
      }, ACTION_WAIT_TIMEOUT)
    }
  }, [stack, strength])

  return (
    <Card
      id={cardId}
      card={card}
      isAttacking={isAttacking}
      isFaceDown={isFaceDown}
      isSmall={isSmall}
      isAttackingFromAbove={isOnTop}
      onClick={onClick}
    />
  )
}
