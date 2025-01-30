import { motion } from 'motion/react'
import { FC, useEffect, useState } from 'react'
import { CardContent, CardFooter, CardHeader } from 'src/shared/components'
import { TICK } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import { CardBaseName, CardBases } from 'src/shared/data'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { CardBase } from 'src/shared/types'

interface CardProps {
  baseName: CardBaseName
  id: string
  currentCard?: CardBase
  isFaceDown?: boolean
  isSmall?: boolean
  isAttacking?: boolean
  attacksFromAbove?: boolean
  onClick?: () => void
}

export const Card: FC<CardProps> = ({
  baseName,
  id,
  currentCard,
  isFaceDown = false,
  isSmall = false,
  isAttacking = false,
  attacksFromAbove: isOnTop = false,
  onClick,
}) => {
  const base = CardBases[baseName]
  const card = currentCard || base
  const { strength, cost, rank } = card

  const prevStrength = usePrevious(strength)
  const prevIsFaceDown = usePrevious(isFaceDown)

  const [cardFaceAnimation, setCardFaceAnimation] = useState('')
  const [cardOutlineAnimation, setCardOutlineAnimation] = useState('')
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

  // Attacking animation
  useEffect(() => {
    if (isAttacking) {
      setCardOutlineAnimation('')
      setCardFaceAnimation('')

      setTimeout(() => {
        setCardOutlineAnimation(
          isOnTop
            ? ` ${animations.attackFromTop}`
            : ` ${animations.attackFromBottom}`,
        )
        setCardFaceAnimation(
          isOnTop
            ? ` ${animations.attackFromTopFace}`
            : ` ${animations.attackFromBottomFace}`,
        )
      }, TICK)
    }
  }, [isAttacking, isOnTop])

  // Show or hide card faces
  useEffect(() => {
    if (prevIsFaceDown !== undefined && prevIsFaceDown !== isFaceDown) {
      if (isFaceDown) {
        setTimeout(() => {
          setShouldShowFront(false)
        }, 500)
      } else {
        setShouldShowFront(true)
      }
    }
  }, [isFaceDown, prevIsFaceDown])

  // Strength animations
  useEffect(() => {
    if (prevStrength !== strength) {
      setCardFaceAnimation('')

      setTimeout(() => {
        setCardFaceAnimation(
          prevStrength < strength
            ? ` ${animations.boost}`
            : ` ${animations.damage}`,
        )
      }, TICK)
    }
  }, [strength])

  return (
    <motion.div
      layoutId={id}
      onClick={onClick}
      initial={false}
      data-testid={`${CARD_TEST_ID}${id}`}
      className={`${components.cardOutline}${isSmall ? ` ${components.smallCard}` : ''}${isFaceDown ? ` ${components.cardFlipped}` : ''}${cardOutlineAnimation}`}
    >
      <div className={components.cardPaper}>
        {/* Card Front */}
        {shouldShowFront ? (
          <div
            className={`${components.cardFront}${onClick ? ` ${animations.activeCard}` : ''}${rank === 'unique' ? ` ${components.uniqueCard}` : ''}${cardFaceAnimation}`}
          >
            <CardHeader card={card} id={id} baseStrength={base.strength} />

            <CardContent card={card} id={id} />

            <CardFooter cost={cost} />
          </div>
        ) : null}

        {/* Card Back */}
        <div className={components.cardBack} />
      </div>
    </motion.div>
  )
}
