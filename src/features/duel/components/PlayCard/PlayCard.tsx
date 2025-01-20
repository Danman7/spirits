import { motion } from 'motion/react'
import { FC, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getPhase,
} from 'src/features/duel/selectors'
import {
  agentAttack,
  completeRedraw,
  discardCard,
  drawCardFromDeck,
  moveToNextAttackingAgent,
  playCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'
import { CardStack, DuelCard, Player } from 'src/features/duel/types'
import { triggerPostCardPlay } from 'src/features/duel/utils'
import { getUserId } from 'src/features/user/selectors'
import { CardContent, CardFooter, CardHeader } from 'src/shared/components'
import { TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'

interface PlayCardProps {
  card: DuelCard
  player: Player
  stack: CardStack
  isOnTop?: boolean
}

export const PlayCard: FC<PlayCardProps> = ({
  card,
  player,
  stack,
  isOnTop = false,
}) => {
  const {
    id,
    name,
    description,
    flavor,
    categories,
    factions,
    cost,
    base,
    rank,
    strength,
    type,
  } = card

  const { id: playerId, hasPerformedAction, coins } = player

  const dispatch = useAppDispatch()
  const phase = useAppSelector(getPhase)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const userId = useAppSelector(getUserId)

  const isFaceDown = isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)
  const isSmall = ['deck', 'discard', 'board'].includes(stack)
  const isUserActive = playerId === userId && playerId === activePlayerId
  const isAttacking = id === attackingAgentId

  const prevStrength = usePrevious(strength)
  const prevIsFaceDown = usePrevious(isFaceDown)

  const [cardFaceAnimation, setCardFaceAnimation] = useState('')
  const [cardOutlineAnimation, setCardOutlineAnimation] = useState('')
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

  const onClick = useMemo(() => {
    if (stack === 'hand' && !hasPerformedAction && !isOnTop) {
      if (phase === 'Player Turn' && isUserActive && cost <= coins) {
        return () => {
          dispatch(playCard({ cardId: card.id, playerId, shouldPay: true }))

          triggerPostCardPlay({
            card,
            playerId,
            dispatch,
          })
        }
      }

      if (phase === 'Redrawing') {
        return () => {
          dispatch(
            putCardAtBottomOfDeck({
              cardId: card.id,
              playerId,
            }),
          )
          dispatch(drawCardFromDeck(playerId))
          dispatch(completeRedraw(playerId))
        }
      }
    }

    return undefined
  }, [
    card,
    stack,
    isOnTop,
    hasPerformedAction,
    isUserActive,
    phase,
    playerId,
    cost,
    coins,
    dispatch,
  ])

  const onAnimationEnd = () => {
    // Move to next agent on end of attacking animation.
    if (isAttacking) {
      dispatch(agentAttack())
      dispatch(moveToNextAttackingAgent())
    }
  }

  // Attack animations
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
      dispatch(discardCard({ cardId: id, playerId }))
    }
  }, [dispatch, id, type, playerId, strength])

  return (
    <motion.div
      layout
      layoutId={id}
      data-testid={`${CARD_TEST_ID}${id}`}
      onAnimationEnd={onAnimationEnd}
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

            <CardContent description={description} flavor={flavor} />

            <CardFooter cost={cost} />
          </div>
        ) : null}

        {/* Card Back */}
        <div className={components.cardBack} />
      </div>
    </motion.div>
  )
}
