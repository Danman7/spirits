import { FC, useEffect } from 'react'
import { AnimationProps, motion, useAnimationControls } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { CardProps } from 'src/Cards/CardTypes'
import { usePrevious } from 'src/shared/utils/customHooks'
import {
  CardBackVariants,
  CardBoostAnimation,
  CardDamageAnimation,
  CardVariants,
  NumberChangeAnimation
} from 'src/shared/utils/animations'
import { getFactionColor, joinCardTypes } from 'src/Cards/CardUtils'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'

const Card: FC<CardProps> = ({ card, isFaceDown, isSmaller, onClickCard }) => {
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

  const prevStrength = usePrevious(strength)

  const strengthChangeAnimation = useAnimationControls()
  const cardAnimationControls = useAnimationControls()

  const animate: AnimationProps['animate'] = []

  if (isSmaller) {
    animate.push('small')
  } else {
    animate.push('normal')
  }

  if (onClickCard) {
    animate.push('active')
  }

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
  }, [prevStrength, strength, strengthChangeAnimation, cardAnimationControls])

  return (
    <motion.div animate={cardAnimationControls}>
      <motion.div
        layoutId={id}
        initial={false}
        animate={animate}
        onClick={onClickCard ? () => onClickCard(card) : undefined}
        variants={CardVariants}
        className={styles.card}
      >
        {isFaceDown ? (
          <motion.div
            initial={false}
            className={styles.cardBack}
            variants={CardBackVariants}
          />
        ) : (
          <>
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
              <div className={styles.cardTypes}>{joinCardTypes(types)}</div>
            </div>
            <div className={styles.cardContent}>
              <p>{description}</p>
              <div className={styles.cardFlavor}>{flavor}</div>
            </div>
            <div className={styles.cardFooter}>Cost: {cost}</div>
          </>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Card
