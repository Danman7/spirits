import { FC } from 'react'
import {
  CardFlavor,
  StyledCardContent,
} from 'src/shared/components/Card/styles'
import { traitDescriptions } from 'src/shared/messages'
import { CardBase, TraitName } from 'src/shared/types'

interface CardContentProps {
  card: CardBase
  id: string
}

export const CardContent: FC<CardContentProps> = ({ card, id }) => {
  const { description, flavor, traits } = card

  return (
    <StyledCardContent>
      {description
        ? description.map((paragraph, index) => (
            <p key={`${id}-description-${index}`}>{paragraph}</p>
          ))
        : null}

      {traits
        ? Object.keys(traits).map((trait: TraitName) => (
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
