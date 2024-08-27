import { FC, useEffect, useState } from 'react'
import { motion, useAnimationControls } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { CardProps } from 'src/Cards/CardTypes'
import { usePrevious } from 'src/shared/utils/customHooks'
import {
  CardBoostAnimation,
  CardPaperVariants,
  NumberChangeAnimation
} from 'src/shared/utils/animations'
import { getFactionColor, joinCardTypes } from 'src/Cards/CardUtils'
import { PositiveNegativeNumber } from 'src/shared/components/PositiveNegativeNumber'

const enum ShowCardFace {
  FRONT,
  BACK,
  BOTH
}

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

  const [cardPaperVariant, setCardPaperVariant] = useState(
    isFaceDown ? 'faceDown' : 'faceUp'
  )
  const [showCardFace, setShowCardFace] = useState(
    isFaceDown ? ShowCardFace.BACK : ShowCardFace.FRONT
  )

  const onCardFlipStart = () => {
    if (
      (isFaceDown && showCardFace !== ShowCardFace.BACK) ||
      (!isFaceDown && showCardFace !== ShowCardFace.FRONT)
    ) {
      setShowCardFace(ShowCardFace.BOTH)
    }
  }

  const onCardFlipEnd = () => {
    if (isFaceDown) {
      return setShowCardFace(ShowCardFace.BACK)
    }

    setShowCardFace(ShowCardFace.FRONT)
  }

  useEffect(() => {
    if (prevStrength && prevStrength !== strength) {
      strengthChangeAnimation.start(NumberChangeAnimation)
    }

    if ((prevStrength as number) < (strength as number)) {
      cardBoostAnimation.start(CardBoostAnimation)
    }
  }, [prevStrength, strength, strengthChangeAnimation, cardBoostAnimation])

  useEffect(() => {
    if (isFaceDown) {
      return setCardPaperVariant('faceDown')
    }

    setCardPaperVariant('faceUp')
  }, [isFaceDown])

  return (
    <motion.div
      layoutId={id}
      onClick={onClickCard ? () => onClickCard(card) : undefined}
      className={`${styles.card} ${isSmaller ? styles.smallCard : ''} ${isActive ? styles.activeCard : ''}`}
    >
      <motion.div
        className={styles.cardPaper}
        initial={isFaceDown ? 'faceDown' : 'faceUp'}
        variants={CardPaperVariants}
        animate={cardPaperVariant}
        onAnimationStart={onCardFlipStart}
        onAnimationComplete={onCardFlipEnd}
      >
        {(showCardFace === ShowCardFace.BOTH ||
          showCardFace === ShowCardFace.FRONT) && (
          <motion.div
            animate={cardBoostAnimation}
            className={`${styles.cardFront}  ${isActive ? styles.activeCardFront : ''}`}
          >
            <div
              className={styles.cardHeader}
              style={{ background: getFactionColor(factions) }}
            >
              <div className={styles.cardTitle}>
                <div>{name}</div>
                {strength && prototype.strength && (
                  <motion.div animate={strengthChangeAnimation}>
                    <PositiveNegativeNumber
                      current={strength}
                      base={prototype.strength}
                    />
                  </motion.div>
                )}
              </div>
              <div className={styles.cardTypes}>{joinCardTypes(types)}</div>
            </div>
            <div className={styles.cardContent}>
              <p>{description}</p>
              <div className={styles.cardFlavor}>{flavor}</div>
            </div>
            <div className={styles.cardFooter}>Cost: {cost}</div>
          </motion.div>
        )}
        {(showCardFace === ShowCardFace.BOTH ||
          showCardFace === ShowCardFace.BACK) && (
          <div className={styles.cardBack}></div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Card
