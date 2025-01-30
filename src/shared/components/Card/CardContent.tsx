import { FC } from 'react'
import { traitDescriptions } from 'src/shared/messages'
import components from 'src/shared/styles/components.module.css'
import { CardBase, TraitName } from 'src/shared/types'

interface CardContentProps {
  card: CardBase
  id: string
}

export const CardContent: FC<CardContentProps> = ({ card, id }) => {
  const { description, flavor, traits } = card

  return (
    <div className={components.cardContent}>
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

      <div className={components.cardFlavor}>
        <small>{flavor}</small>
      </div>
    </div>
  )
}
