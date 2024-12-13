import { motion } from 'motion/react'
import { forwardRef, useEffect, useState } from 'react'

import { DuelCard } from 'src/features/cards/types'
import { ColoredNumber } from 'src/shared/components/ColoredNumber'
import { TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'

export interface CardProps {
  card: DuelCard
  isFaceDown?: boolean
  isSmall?: boolean
  isAttacking?: boolean
  isOnTop?: boolean
  onClickCard?: (cardId: string) => void
  onAttackAnimationEnd?: () => void
}

export const Card = motion.create(
  forwardRef<HTMLDivElement, CardProps>(
    (
      {
        card,
        isSmall = false,
        isFaceDown = false,
        isAttacking = false,
        isOnTop = false,
        onClickCard,
        onAttackAnimationEnd,
      },
      ref,
    ) => {
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
      } = card

      const prevStrength = usePrevious(strength)
      const prevIsFaceDown = usePrevious(isFaceDown)

      const [cardFaceAnimation, setCardFaceAnimation] = useState('')
      const [cardOutlineAnimation, setCardOutlineAnimation] = useState('')
      const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

      const onClick = onClickCard ? () => onClickCard(id) : undefined

      const onAnimationEnd = () => {
        if (isAttacking && onAttackAnimationEnd) {
          onAttackAnimationEnd()
        }
      }

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

      return (
        <motion.div
          ref={ref}
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
                    <span>{name}</span>
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
    },
  ),
  {
    forwardMotionProps: true,
  },
)
