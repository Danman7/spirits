import { StyledCardFooter } from 'src/shared/modules/cards/components/styles'
import { Card } from 'src/shared/modules/cards/types'

interface CardFooterProps {
  card: Card
}

export const CardFooter: React.FC<CardFooterProps> = ({ card }) => {
  const { type, cost } = card

  return (
    <StyledCardFooter>
      <span>Cost: {cost}</span>
      {type === 'agent' && card.counter ? (
        <span>Counter: {card.counter}</span>
      ) : null}
    </StyledCardFooter>
  )
}
