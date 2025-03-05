import { Icon } from 'src/shared/components/Icon'
import {
  FooterSection,
  StyledCardFooter,
} from 'src/shared/modules/cards/components/styles'
import { AgentTraitName, Card } from 'src/shared/modules/cards/types'

interface CardFooterProps {
  card: Card
}

export const CardFooter: React.FC<CardFooterProps> = ({ card }) => {
  const { type, cost } = card

  return (
    <StyledCardFooter>
      <FooterSection>
        <Icon name="Coins" isSmall /> {cost}
      </FooterSection>

      {type === 'agent' && card.traits ? (
        <FooterSection>
          {Object.keys(card.traits).map((trait: AgentTraitName) => (
            <Icon key={trait} name={trait} isSmall />
          ))}
        </FooterSection>
      ) : null}

      {type === 'agent' && card.counter ? (
        <FooterSection>
          <Icon name="Hourglass" isSmall /> {card.counter}
        </FooterSection>
      ) : null}
    </StyledCardFooter>
  )
}
