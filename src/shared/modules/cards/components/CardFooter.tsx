import { Icon } from 'src/shared/components'
import type { AgentTraitName, Card } from 'src/shared/modules/cards/cards.types'
import {
  FooterSection,
  StyledCardFooter,
} from 'src/shared/modules/cards/components/Card.styles'

interface CardFooterProps {
  card: Card
}

export const CardFooter: React.FC<CardFooterProps> = ({ card }) => {
  const { type, cost, isElite } = card

  return (
    <StyledCardFooter $isElite={!!isElite}>
      <FooterSection>
        <Icon name="Coins" /> {cost}
      </FooterSection>

      {type === 'agent' && card.traits ? (
        <FooterSection>
          {Object.keys(card.traits).map((trait: AgentTraitName) => (
            <Icon key={trait} name={trait} />
          ))}
        </FooterSection>
      ) : null}

      {type === 'agent' && card.counter ? (
        <FooterSection>
          <Icon name="Hourglass" /> {card.counter}
        </FooterSection>
      ) : null}
    </StyledCardFooter>
  )
}
