import { FC, useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import styles from '../../styles.module.css'
import * as Animations from '../../utils/animations'

import { getFactionColor, joinCardTypes } from '../CardUtils'
import { PositiveNegativeNumber } from './PositiveNegativeNumber'
import { usePrevious } from '../../utils/customHooks'
import { CardProps } from '../CardTypes'

const enum ShowCardFace {
  FRONT,
  BACK,
  BOTH
}

export const Card: FC<CardProps> = ({
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

  const [cardPaperVariant, setCardPaperVariant] = useState('')
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
    if (prevStrength !== strength) {
      // TODO: strength change animation
    }

    if ((prevStrength as number) < (strength as number)) {
      // TODO: boost animation
    }
  }, [prevStrength, strength])

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
        variants={Animations.cardPaperVariants}
        animate={cardPaperVariant}
        onAnimationStart={onCardFlipStart}
        onAnimationComplete={onCardFlipEnd}
      >
        {(showCardFace === ShowCardFace.BOTH ||
          showCardFace === ShowCardFace.FRONT) && (
          <div className={styles.cardFront}>
            <div
              className={styles.cardHeader}
              style={{ background: getFactionColor(factions) }}
            >
              <div className={styles.cardTitle}>
                <div>{name}</div>
                <div>
                  {strength && prototype.strength && (
                    <PositiveNegativeNumber
                      current={strength}
                      base={prototype.strength}
                    />
                  )}
                </div>
              </div>
              <div className={styles.cardTypes}>{joinCardTypes(types)}</div>
            </div>
            <div className={styles.cardContent}>
              <p>{description}</p>
              <div className={styles.cardFlavor}>{flavor}</div>
            </div>
            <div className={styles.cardFooter}>Cost: {cost}</div>
          </div>
        )}
        {(showCardFace === ShowCardFace.BOTH ||
          showCardFace === ShowCardFace.BACK) && (
          <div className={styles.cardBack}></div>
        )}
      </motion.div>
    </motion.div>
  )
}
