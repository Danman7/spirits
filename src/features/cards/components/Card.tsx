import { motion, useAnimationControls } from 'motion/react'
import { forwardRef, useEffect } from 'react'

import { CardProps } from 'src/features/cards/types'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'
import {
  getCardAttackAnimation,
  CardBoostAnimation,
  CardDamageAnimation,
  NumberChangeAnimation,
} from 'src/shared/animations'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'
import { usePrevious } from 'src/shared/customHooks'
import styles from 'src/shared/styles/styles.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'

const CardComponent = motion.create(
  forwardRef<HTMLDivElement, CardProps>(
    (
      {
        card,
        isSmall = false,
        isFaceDown = false,
        isAttacking = false,
        isOnTop = false,
        onClickCard,
        onAnimationComplete,
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

      const strengthChangeAnimation = useAnimationControls()
      const cardAnimationControls = useAnimationControls()

      useEffect(() => {
        if (strength && prevStrength) {
          if (prevStrength && prevStrength !== strength) {
            strengthChangeAnimation.start(NumberChangeAnimation)
          }

          if (prevStrength < strength) {
            cardAnimationControls.start(CardBoostAnimation)
          }

          if (prevStrength > strength) {
            cardAnimationControls.start(CardDamageAnimation)
          }
        }
      }, [
        prevStrength,
        strength,
        strengthChangeAnimation,
        cardAnimationControls,
      ])

      useEffect(() => {
        if (isAttacking) {
          cardAnimationControls.start(getCardAttackAnimation(isOnTop))
        }
      }, [isAttacking, cardAnimationControls, isOnTop])

      return isFaceDown ? (
        <motion.div
          ref={ref}
          className={`${styles.card} ${styles.cardBack} ${isSmall ? styles.smallCard : ''}`}
        />
      ) : (
        <motion.div
          ref={ref}
          data-testid={`${CARD_TEST_ID}${id}`}
          animate={cardAnimationControls}
          onAnimationComplete={onAnimationComplete}
          onClick={onClickCard ? () => onClickCard(id) : undefined}
          className={`${styles.card} ${isSmall ? styles.smallCard : ''} ${onClickCard ? styles.activeCard : ''} ${rank === 'unique' ? styles.uniqueCard : ''}`}
        >
          <div
            className={styles.cardHeader}
            style={{ background: getFactionColor(factions) }}
          >
            <h3 className={styles.cardTitle}>
              <span>{name}</span>
              {!!strength && (
                <motion.div animate={strengthChangeAnimation}>
                  <PositiveNegativeNumber
                    current={strength}
                    base={base.strength}
                  />
                </motion.div>
              )}
            </h3>

            <small>{joinCardCategories(categories)}</small>
          </div>
          <div className={styles.cardContent}>
            {description.map((paragraph, index) => (
              <p key={`${id}-description-${index}`}>{paragraph}</p>
            ))}

            <small className={styles.cardFlavor}>{flavor}</small>
          </div>
          <div className={styles.cardFooter}>Cost: {cost}</div>
        </motion.div>
      )
    },
  ),
  {
    forwardMotionProps: true,
  },
)

export default CardComponent
