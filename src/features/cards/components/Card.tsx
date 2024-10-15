import { FC, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import { Card, CardProps } from 'src/features/cards/types'
import { getFactionColor, joinCardTypes } from 'src/features/cards/utils'

import styles from 'src/shared/styles/styles.module.css'
import { usePrevious } from 'src/shared/customHooks'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'
import {
  CardAttackAnimation,
  CardBoostAnimation,
  CardDamageAnimation,
  NumberChangeAnimation,
} from 'src/shared/animations'

const CardComponent: FC<CardProps<Card>> = ({
  card,
  isSmall,
  isFaceDown,
  isAttacking,
  isOnTop,
  onClickCard,
}) => {
  const {
    id,
    name,
    description,
    flavor,
    types,
    factions,
    cost,
    prototype,
    kind,
  } = card

  const strength = kind === 'agent' ? card.strength : undefined

  const prevStrength = strength ? usePrevious(strength) : undefined

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
  }, [prevStrength, strength, strengthChangeAnimation, cardAnimationControls])

  useEffect(() => {
    if (isAttacking) {
      cardAnimationControls.start(CardAttackAnimation(isOnTop))
    }
  }, [isAttacking])

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
          <div style={{ textAlign: 'center', flexGrow: 2 }}>{name}</div>
          {kind === 'agent' && strength && (
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
        {description.map((paragraph, index) => (
          <p key={`${id}-description-${index}`}>{paragraph}</p>
        ))}

        <small className={styles.cardFlavor}>{flavor}</small>
      </div>
      <div className={styles.cardFooter}>Cost: {cost}</div>
    </motion.div>
  )
}

export default CardComponent
