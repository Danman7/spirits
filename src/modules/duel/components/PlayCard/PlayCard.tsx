import { motion } from 'motion/react'
import { FC, useEffect, useMemo, useState } from 'react'
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
import { CardContent, CardFooter, CardHeader } from 'src/shared/components'
import { ACTION_WAIT_TIMEOUT, TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { getDuelCardsBase } from 'src/shared/utils'

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
  const { name, categories, factions, cost, base, rank, strength, type } = card

  const isFaceDown = isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)
  const isSmall = ['deck', 'discard', 'board'].includes(stack)
  const isUserActive = playerId === userId && playerId === activePlayerId
  const isAttacking = cardId === attackingAgentId

  const prevStrength = usePrevious(strength)
  const prevIsFaceDown = usePrevious(isFaceDown)

  const [cardFaceAnimation, setCardFaceAnimation] = useState('')
  const [cardOutlineAnimation, setCardOutlineAnimation] = useState('')
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

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
    if (isAttacking) {
      setCardOutlineAnimation('')
      setCardFaceAnimation('')

      setTimeout(() => {
        setCardOutlineAnimation(
          isOnTop
            ? ` ${animations.attackFromTop}`
            : ` ${animations.attackFromBottom}`,
        )
        setCardFaceAnimation(
          isOnTop
            ? ` ${animations.attackFromTopFace}`
            : ` ${animations.attackFromBottomFace}`,
        )
      }, TICK)

      dispatch(
        agentAttack({
          defendingAgentId: attackingQueue.find(
            ({ attackerId }) => attackerId === cardId,
          )?.defenderId,
          defendingPlayerId: getOppositePlayerId(players, playerId),
        }),
      )

      setTimeout(() => {
        dispatch(moveToNextAttackingAgent())
      }, ACTION_WAIT_TIMEOUT)
    }
  }, [isAttacking, isOnTop])

  // Show or hide card faces.
  useEffect(() => {
    if (prevIsFaceDown !== undefined && prevIsFaceDown !== isFaceDown) {
      if (isFaceDown) {
        setTimeout(() => {
          setShouldShowFront(false)
        }, 500)
      } else {
        setShouldShowFront(true)
      }
    }
  }, [isFaceDown, prevIsFaceDown])

  // Strength animations
  useEffect(() => {
    if (prevStrength !== undefined && prevStrength !== strength) {
      setCardFaceAnimation('')

      setTimeout(() => {
        setCardFaceAnimation(
          prevStrength < strength
            ? ` ${animations.boost}`
            : ` ${animations.damage}`,
        )
      }, TICK)
    }
  }, [strength, prevStrength])

  // Discard on defeat
  useEffect(() => {
    if (type === 'agent' && strength <= 0) {
      dispatch(discardCard({ cardId, playerId }))
    }
  }, [cardId, dispatch, playerId, strength, type])

  return (
    <motion.div
      layout
      layoutId={cardId}
      data-testid={`${CARD_TEST_ID}${cardId}`}
      onClick={onClick}
      initial={false}
      className={`${components.cardOutline}${isSmall ? ` ${components.smallCard}` : ''}${isFaceDown ? ` ${components.cardFlipped}` : ''}${cardOutlineAnimation}`}
    >
      <div className={components.cardPaper}>
        {/* Card Front */}
        {shouldShowFront ? (
          <div
            className={`${components.cardFront}${onClick ? ` ${animations.activeCard}` : ''}${rank === 'unique' ? ` ${components.uniqueCard}` : ''}${cardFaceAnimation}`}
          >
            <CardHeader
              factions={factions}
              categories={categories}
              name={name}
              strength={strength}
              baseStrength={base.strength}
            />

            <CardContent card={getDuelCardsBase(card)} />

            <CardFooter cost={cost} />
          </div>
        ) : null}

        {/* Card Back */}
        <div className={components.cardBack} />
      </div>
    </motion.div>
  )
}
