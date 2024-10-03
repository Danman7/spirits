import { forwardRef, useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import { CardProps } from 'src/features/cards/types'
import { getFactionColor, joinCardTypes } from 'src/features/cards/utils'

import styles from 'src/shared/styles/styles.module.css'
import { usePrevious } from 'src/shared/customHooks'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'
import {
  CardBackVariants,
  CardBoostAnimation,
  CardDamageAnimation,
  CardPaperVariants,
  CardVariants,
  NumberChangeAnimation,
} from 'src/shared/animations'

type CardSide = 'FRONT' | 'BACK'

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
        prototype,
      } = card

      const isCardFaceDown = animate?.toString().includes('faceDown')

      const [activeSide, setActiveSide] = useState<CardSide>(
        isCardFaceDown ? 'BACK' : 'FRONT',
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
        cardAnimationControls,
      ])

      return (
        <motion.div animate={cardAnimationControls}>
          <motion.div
            ref={ref}
            layoutId={id}
            initial={false}
            animate={animate}
            onClick={onClickCard ? () => onClickCard(id) : undefined}
            variants={CardVariants}
            className={styles.card}
          >
            <motion.div
              className={styles.cardPaper}
              onAnimationStart={() => setActiveSide('FRONT')}
              onAnimationComplete={() =>
                setActiveSide(isCardFaceDown ? 'BACK' : 'FRONT')
              }
              variants={CardPaperVariants}
            >
              {activeSide === 'FRONT' && (
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
                    <h5 className={styles.cardTypes}>{joinCardTypes(types)}</h5>
                  </div>
                  <div className={styles.cardContent}>
                    <p>{description}</p>
                    <small className={styles.cardFlavor}>{flavor}</small>
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
    },
  ),
  { forwardMotionProps: true },
)

export default Card
