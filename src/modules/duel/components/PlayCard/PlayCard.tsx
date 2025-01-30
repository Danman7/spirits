import { FC, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getattackingQueue,
  getPhase,
  getPlayers,
} from 'src/modules/duel/selectors'
import {
  agentAttack,
  completeRedraw,
  discardCard,
  drawCardFromDeck,
  moveToNextAttackingAgent,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/modules/duel/slice'
import { CardStack } from 'src/modules/duel/types'
import { getOppositePlayerId } from 'src/modules/duel/utils'
import { getUserId } from 'src/modules/user/selectors'
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
  const duelCard = cards[cardId]
  const { id, baseName, ...baseCard } = duelCard
  const { strength } = baseCard

  const isFaceDown = isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)
  const isSmall = ['deck', 'discard', 'board'].includes(stack)
  const isUserActive = playerId === userId && playerId === activePlayerId
  const isAttacking = cardId === attackingAgentId

  const onClick = useMemo(() => {
    if (stack === 'hand' && !hasPerformedAction && !isOnTop) {
      if (phase === 'Player Turn' && isUserActive && duelCard.cost <= coins) {
        return () => {
          dispatch(playCard({ cardId, playerId, shouldPay: true }))
        }
      }

      if (phase === 'Redrawing') {
        return () => {
          dispatch(
            putCardAtBottomOfDeck({
              cardId: cardId,
              playerId,
            }),
          )
          dispatch(drawCardFromDeck(playerId))
          dispatch(completeRedraw(playerId))
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
      baseName={baseName}
      currentCard={baseCard}
      id={id}
      isAttackingFromAbove={isOnTop}
      isAttacking={isAttacking}
      isFaceDown={isFaceDown}
      isSmall={isSmall}
      onClick={onClick}
    />
  )
}
