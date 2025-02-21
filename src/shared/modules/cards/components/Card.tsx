import { CardContent } from 'src/shared/modules/cards/components/CardContent'
import { CardFooter } from 'src/shared/modules/cards/components/CardFooter'
import { CardHeader } from 'src/shared/modules/cards/components/CardHeader'
import {
  useCardStrengthAnimation,
  useCardVisibility,
} from 'src/shared/modules/cards/components/hooks'
import {
  CardBack,
  CardFront,
  CardOutline,
  CardPaper,
} from 'src/shared/modules/cards/components/styles'
import { Card } from 'src/shared/modules/cards/types'
import { CARD_TEST_ID } from 'src/shared/test/testIds'

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
  const { type, isUnique } = card
  const strength = type === 'agent' ? card.strength : 0

  const cardStrengthAnimateState = useCardStrengthAnimation(strength)
  const shouldShowFront = useCardVisibility(isFaceDown)

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
        {shouldShowFront ? (
          <CardFront
            $isSmall={isSmall}
            $isAttacking={isAttacking}
            $isAttackingFromAbove={isAttackingFromAbove}
            $isActive={!!onClick}
            $isUnique={isUnique}
            $cardStrengthAnimateState={cardStrengthAnimateState}
          >
            <CardHeader card={card} id={id} />
            <CardContent card={card} id={id} />
            <CardFooter card={card} />
          </CardFront>
        ) : null}

        <CardBack $isSmall={isSmall} />
      </CardPaper>
    </CardOutline>
  )
}
