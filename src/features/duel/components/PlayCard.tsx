import { motion } from 'motion/react'
import { FC, useEffect, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'
import {
  agentAttack,
  discardCard,
  moveToNextAttackingAgent,
} from 'src/features/duel/slice'
import { DuelCard } from 'src/features/duel/types'
import { ColoredNumber } from 'src/shared/components/ColoredNumber'
import { TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'

export interface PlayCardProps {
  card: DuelCard
  playerId: string
  isFaceDown?: boolean
  isSmall?: boolean
  isAttacking?: boolean
  isOnTop?: boolean
  onClickCard?: (card: DuelCard) => void
}

export const PlayCard: FC<PlayCardProps> = ({
  card,
  playerId,
  isSmall = false,
  isFaceDown = false,
  isAttacking = false,
  isOnTop = false,
  onClickCard,
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
  const dispatch = useAppDispatch()
  const prevStrength = usePrevious(strength)
  const prevIsFaceDown = usePrevious(isFaceDown)
  const [cardFaceAnimation, setCardFaceAnimation] = useState('')
  const [cardOutlineAnimation, setCardOutlineAnimation] = useState('')
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)
  const onClick = onClickCard ? () => onClickCard(card) : undefined

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
            className={`${components.cardFront}${onClickCard ? ` ${animations.activeCard}` : ''}${rank === 'unique' ? ` ${components.uniqueCard}` : ''}${cardFaceAnimation}`}
          >
            <div
              className={components.cardHeader}
              style={{ background: getFactionColor(factions) }}
            >
              <h3 className={components.cardTitle}>
                {name}
                {!!strength && (
                  <ColoredNumber current={strength} base={base.strength} />
                )}
              </h3>

              <small>{joinCardCategories(categories)}</small>
            </div>
            <div className={components.cardContent}>
              {description.map((paragraph, index) => (
                <p key={`${id}-description-${index}`}>{paragraph}</p>
              ))}

              <div className={components.cardFlavor}>
                <small>{flavor}</small>
              </div>
            </div>
            <div className={components.cardFooter}>Cost: {cost}</div>
          </div>
        ) : null}

        {/* Card Back */}
        <div className={components.cardBack} />
      </div>
    </motion.div>
  )
}
