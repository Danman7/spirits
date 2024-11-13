import { motion, useAnimationControls } from 'framer-motion'
import { forwardRef, useEffect } from 'react'

import { useAppDispatch } from 'src/app/store'
import { CardProps } from 'src/features/cards/types'
import { getFactionColor, joinCardCategories } from 'src/features/cards/utils'
import { moveToNextAttacker } from 'src/features/duel/slice'
import {
  CardAttackAnimation,
  CardBoostAnimation,
  CardDamageAnimation,
  NumberChangeAnimation,
} from 'src/shared/animations'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'
import { usePrevious } from 'src/shared/customHooks'
import styles from 'src/shared/styles/styles.module.css'

const CardComponent = motion.create(
  forwardRef<HTMLDivElement, CardProps>(
    ({ card, isSmall, isFaceDown, isAttacking, isOnTop, onClickCard }, ref) => {
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
      const dispatch = useAppDispatch()

      const strengthChangeAnimation = useAnimationControls()
      const cardAnimationControls = useAnimationControls()

      const onAnimationComplete = () => {
        if (isAttacking) {
          dispatch(moveToNextAttacker())
        }
      }

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
          cardAnimationControls.start(CardAttackAnimation(isOnTop))
        }
      }, [isAttacking, cardAnimationControls, isOnTop])

      return isFaceDown ? (
        <motion.div
          ref={ref}
          className={`${styles.cardBack} ${isSmall ? styles.smallCardBack : ''}`}
        />
      ) : (
        <motion.div
          ref={ref}
          animate={cardAnimationControls}
          onAnimationComplete={onAnimationComplete}
          onClick={onClickCard ? () => onClickCard(id) : undefined}
          className={`${styles.card} ${isSmall ? styles.smallCard : ''} ${onClickCard ? styles.activeCard : ''} ${rank === 'common' ? styles.commonCard : styles.uniqueCard}`}
        >
          <div
            className={styles.cardHeader}
            style={{ background: getFactionColor(factions) }}
          >
            <h4 className={styles.cardTitle}>
              <span>{name}</span>
              {strength && (
                <motion.div animate={strengthChangeAnimation}>
                  <PositiveNegativeNumber
                    current={strength}
                    base={base.strength || 0}
                  />
                </motion.div>
              )}
            </h4>

            <h5>{joinCardCategories(categories)}</h5>
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
)

export default CardComponent
