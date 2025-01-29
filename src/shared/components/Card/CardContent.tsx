import { FC } from 'react'
import { retaliatesDescription, retaliatesTitle } from 'src/shared/messages'
import components from 'src/shared/styles/components.module.css'
import { CardBase } from 'src/shared/types'
import { generateUUID } from 'src/shared/utils'

interface CardContentProps {
  card: CardBase
}

export const CardContent: FC<CardContentProps> = ({ card }) => {
  const { description, flavor, type } = card

  const retaliates = type === 'agent' ? card.retaliates : ''

  return (
    <div className={components.cardContent}>
      {description
        ? description.map((paragraph, index) => (
            <p key={`${generateUUID()}-description-${index}`}>{paragraph}</p>
          ))
        : null}

      {retaliates ? (
        <p>
          <strong>{retaliatesTitle}</strong> {retaliatesDescription}
        </p>
      ) : null}

      <div className={components.cardFlavor}>
        <small>{flavor}</small>
      </div>
    </div>
  )
}
