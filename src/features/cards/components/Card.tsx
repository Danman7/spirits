import { FC, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import { CardProps } from 'src/features/cards/types'
import { getFactionColor, joinCardTypes } from 'src/features/cards/utils'

import styles from 'src/shared/styles/styles.module.css'
import { usePrevious } from 'src/shared/customHooks'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'
import {
  CardBoostAnimation,
  CardDamageAnimation,
  NumberChangeAnimation,
} from 'src/shared/animations'

const Card: FC<CardProps> = ({ card, isSmall, isFaceDown, onClickCard }) => {
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
  }, [prevStrength, strength, strengthChangeAnimation, cardAnimationControls])

  return isFaceDown ? (
    <motion.div
      layoutId={id}
      className={`${styles.cardBack} ${isSmall ? styles.smallCardBack : ''}`}
    />
  ) : (
    <motion.div
      layoutId={id}
      initial={false}
      animate={cardAnimationControls}
      onClick={onClickCard ? () => onClickCard(id) : undefined}
      className={`${styles.card} ${isSmall ? styles.smallCard : ''} ${onClickCard ? styles.activeCard : ''}`}
    >
      <div
        className={styles.cardHeader}
        style={{ background: getFactionColor(factions) }}
      >
        <h4 className={styles.cardTitle}>
          <div>{name}</div>
          {strength && prototype.strength && (
            <motion.div animate={strengthChangeAnimation}>
              <PositiveNegativeNumber
                current={strength}
                base={prototype.strength}
              />
            </motion.div>
          )}
        </h4>
        <h5 className={styles.cardTypes}>{joinCardTypes(types)}</h5>
      </div>
      <div className={styles.cardContent}>
        <p>{description}</p>
        <small className={styles.cardFlavor}>{flavor}</small>
      </div>
      <div className={styles.cardFooter}>Cost: {cost}</div>
    </motion.div>
  )
}

export default Card
