import {
  CardFlavor,
  StyledCardContent,
} from 'src/shared/components/Card/styles'
import { traitDescriptions } from 'src/shared/messages'
import { Card, AgentTraitName } from 'src/shared/types'

interface CardContentProps {
  card: Card
  id: string
}

export const CardContent: React.FC<CardContentProps> = ({ card, id }) => {
  const { description, type, flavor } = card

  return (
    <StyledCardContent>
      {description
        ? description.map((paragraph, index) => (
            <p key={`${id}-description-${index}`}>{paragraph}</p>
          ))
        : null}

      {type === 'agent' && card.traits
        ? Object.keys(card.traits).map((trait: AgentTraitName) => (
            <p key={`${id}-${trait}`}>
              <strong>{traitDescriptions[trait].title}</strong>{' '}
              {traitDescriptions[trait].description}
            </p>
          ))
        : null}

      <CardFlavor>{flavor}</CardFlavor>
    </StyledCardContent>
  )
}
