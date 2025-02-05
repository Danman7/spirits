import { useEffect, useState } from 'react'
import {
  CardBack,
  CardContent,
  CardFooter,
  CardFront,
  CardHeader,
  CardOutline,
  CardPaper,
} from 'src/shared/components'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
import { usePrevious } from 'src/shared/customHooks'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { Card, CardStrengthAnimateState } from 'src/shared/types'

interface CardProps {
  id: string
  card: Card
  isFaceDown?: boolean
  isSmall?: boolean
  isAttacking?: boolean
  isAttackingFromAbove?: boolean
  onClick?: () => void
}

export const CardComponent: React.FC<CardProps> = ({
  id,
  card,
  isFaceDown = false,
  isSmall = false,
  isAttacking = false,
  isAttackingFromAbove = false,
  onClick,
}) => {
  const { type, rank } = card

  const strength = type === 'agent' ? card.strength : 0
  const prevStrength = usePrevious(strength)
  const prevIsFaceDown = usePrevious(isFaceDown)

  const [cardStrengthAnimateState, setCardStrengthAnimateState] =
    useState<CardStrengthAnimateState>('')
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

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
    if (type === 'agent' && prevStrength !== strength) {
      setCardStrengthAnimateState('')
      setCardStrengthAnimateState(
        prevStrength < strength ? 'boosted' : 'damaged',
      )

      setTimeout(() => {
        setCardStrengthAnimateState('')
      }, ACTION_WAIT_TIMEOUT)
    }
  }, [strength])

  return (
    <CardOutline
      layoutId={id}
      $isSmall={isSmall}
      initial={false}
      data-testid={`${CARD_TEST_ID}${id}`}
      $isAttacking={isAttacking}
      $isAttackingFromAbove={isAttackingFromAbove}
      onClick={onClick}
    >
      <CardPaper $isFaceDown={isFaceDown} $isSmall={isSmall}>
        {/* Card Front */}
        {shouldShowFront ? (
          <CardFront
            $isSmall={isSmall}
            $isAttacking={isAttacking}
            $isAttackingFromAbove={isAttackingFromAbove}
            $isActive={!!onClick}
            $rank={rank}
            $cardStrengthAnimateState={cardStrengthAnimateState}
          >
            <CardHeader card={card} id={id} />

            <CardContent card={card} id={id} />

            <CardFooter card={card} />
          </CardFront>
        ) : null}

        {/* Card Back */}
        <CardBack $isSmall={isSmall} />
      </CardPaper>
    </CardOutline>
  )
}
