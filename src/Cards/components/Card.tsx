import { forwardRef, useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { CardProps } from 'src/Cards/CardTypes'
import { usePrevious } from 'src/shared/utils/customHooks'
import {
  CardBackVariants,
  CardBoostAnimation,
  CardDamageAnimation,
  CardPaperVariants,
  CardVariants,
  NumberChangeAnimation
} from 'src/shared/utils/animations'
import { getFactionColor, joinCardTypes } from 'src/Cards/CardUtils'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'

const enum CardSide {
  FRONT = 'FRONT',
  BACK = 'BACK'
}

const Card = motion.create(
  forwardRef<HTMLDivElement, CardProps>(
    ({ card, animate, onClickCard }, ref) => {
      const {
        id,
        name,
        strength,
        description,
        flavor,
        types,
        factions,
        cost,
        prototype
      } = card

      const isCardFaceDown = animate?.toString().includes('faceDown')

      const [activeSide, setActiveSide] = useState<CardSide>(
        isCardFaceDown ? CardSide.BACK : CardSide.FRONT
      )

      const prevStrength = usePrevious(strength)

      const strengthChangeAnimation = useAnimationControls()
      const cardAnimationControls = useAnimationControls()

      useEffect(() => {
        if (prevStrength && prevStrength !== strength) {
          strengthChangeAnimation.start(NumberChangeAnimation)
        }

        if (prevStrength < strength) {
          cardAnimationControls.start(CardBoostAnimation)
        }

        if (prevStrength > strength) {
          cardAnimationControls.start(CardDamageAnimation)
        }

        return () => {
          strengthChangeAnimation.stop()
          cardAnimationControls.stop()
        }
      }, [
        prevStrength,
        strength,
        strengthChangeAnimation,
        cardAnimationControls
      ])

      return (
        <motion.div animate={cardAnimationControls}>
          <motion.div
            ref={ref}
            layoutId={id}
            initial={false}
            animate={animate}
            onClick={onClickCard ? () => onClickCard(card) : undefined}
            variants={CardVariants}
            className={styles.card}
          >
            <motion.div
              className={styles.cardPaper}
              onAnimationStart={() => setActiveSide(CardSide.FRONT)}
              onAnimationComplete={() =>
                setActiveSide(isCardFaceDown ? CardSide.BACK : CardSide.FRONT)
              }
              variants={CardPaperVariants}
            >
              {activeSide === CardSide.FRONT && (
                <div className={styles.cardFront}>
                  <div
                    className={styles.cardHeader}
                    style={{ background: getFactionColor(factions) }}
                  >
                    <h3 className={styles.cardTitle}>
                      <div>{name}</div>
                      {strength && prototype.strength && (
                        <motion.div animate={strengthChangeAnimation}>
                          <PositiveNegativeNumber
                            current={strength}
                            base={prototype.strength}
                          />
                        </motion.div>
                      )}
                    </h3>
                    <div className={styles.cardTypes}>
                      {joinCardTypes(types)}
                    </div>
                  </div>
                  <div className={styles.cardContent}>
                    <p>{description}</p>
                    <div className={styles.cardFlavor}>{flavor}</div>
                  </div>
                  <div className={styles.cardFooter}>Cost: {cost}</div>
                </div>
              )}

              <motion.div
                initial={false}
                className={styles.cardBack}
                variants={CardBackVariants}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )
    }
  ),
  { forwardMotionProps: true }
)

export default Card
