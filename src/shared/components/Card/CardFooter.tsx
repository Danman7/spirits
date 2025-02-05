import { StyledCardFooter } from 'src/shared/components/Card/styles'
import { Card } from 'src/shared/types'

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
