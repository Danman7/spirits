import { StyledCardFooter } from 'src/shared/components/Card/styles'
import { CardBase } from 'src/shared/types'

interface CardFooterProps {
  card: CardBase
}

export const CardFooter: React.FC<CardFooterProps> = ({
  card: { cost, counter },
}) => (
  <StyledCardFooter>
    <span>Cost: {cost}</span>
    {counter ? <span>Counter: {counter}</span> : null}
  </StyledCardFooter>
)
