import { StyledCardFooter } from 'src/shared/components/Card/styles'

interface CardFooterProps {
  cost: number
}

export const CardFooter: React.FC<CardFooterProps> = ({ cost }) => (
  <StyledCardFooter>Cost: {cost}</StyledCardFooter>
)
