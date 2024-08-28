import { FC, useEffect } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { CardProps } from 'src/Cards/CardTypes'
import { usePrevious } from 'src/shared/utils/customHooks'
import {
  CardBoostAnimation,
  NumberChangeAnimation
} from 'src/shared/utils/animations'
import { getFactionColor, joinCardTypes } from 'src/Cards/CardUtils'
import PositiveNegativeNumber from 'src/shared/components/PositiveNegativeNumber'

const Card: FC<CardProps> = ({
  card,
  isFaceDown,
  isActive,
  isSmaller,
  onClickCard
}) => {
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
  const cardBoostAnimation = useAnimationControls()

  useEffect(() => {
    if (prevStrength && prevStrength !== strength) {
      strengthChangeAnimation.start(NumberChangeAnimation)
    }

    if ((prevStrength as number) < (strength as number)) {
      cardBoostAnimation.start(CardBoostAnimation)
    }
  }, [prevStrength, strength, strengthChangeAnimation, cardBoostAnimation])

  return (
    <motion.div
      layoutId={id}
      animate={cardBoostAnimation}
      onClick={onClickCard ? () => onClickCard(card) : undefined}
      className={`${styles.card} ${isSmaller ? styles.smallCard : ''} ${isActive ? styles.activeCard : ''}`}
    >
      {isFaceDown ? (
        <div className={styles.cardBack} />
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
  )
}

export default Card
