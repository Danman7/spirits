import type { Card } from 'src/shared/modules/cards/cards.types'
import {
  CardBack,
  CardFront,
  CardOutline,
  CardPaper,
} from 'src/shared/modules/cards/components/Card.styles'
import { CardContent } from 'src/shared/modules/cards/components/CardContent'
import { CardFooter } from 'src/shared/modules/cards/components/CardFooter'
import { CardHeader } from 'src/shared/modules/cards/components/CardHeader'
import {
  useCardStrengthAnimation,
  useCardVisibility,
} from 'src/shared/modules/cards/components/hooks'

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
  const strength = card.type === 'agent' ? card.strength : 0

  const cardStrengthAnimateState = useCardStrengthAnimation(strength)
  const shouldShowFront = useCardVisibility(isFaceDown)

  return (
    <CardOutline
      $isSmall={isSmall}
      $isAttacking={isAttacking}
      $isAttackingFromAbove={isAttackingFromAbove}
      onClick={onClick}
    >
      <CardPaper $isFaceDown={isFaceDown}>
        {shouldShowFront ? (
          <CardFront
            data-testid={id}
            $isAttacking={isAttacking}
            $isAttackingFromAbove={isAttackingFromAbove}
            $isActive={!!onClick}
            $cardStrengthAnimateState={cardStrengthAnimateState}
          >
            <CardHeader card={card} id={id} />
            <CardContent card={card} id={id} />
            <CardFooter card={card} />
          </CardFront>
        ) : null}

        <CardBack />
      </CardPaper>
    </CardOutline>
  )
}
