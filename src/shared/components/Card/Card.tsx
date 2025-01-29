import { FC } from 'react'
import { CardContent, CardFooter, CardHeader } from 'src/shared/components'
import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { CardBase } from 'src/shared/types'

interface CardProps {
  card: CardBase
}

export const Card: FC<CardProps> = ({ card }) => {
  const { type, name, categories, factions, cost, rank } = card

  const strength = type === 'agent' ? card.strength : undefined

  return (
    <div
      data-testid={`${CARD_TEST_ID}${name}`}
      className={components.cardOutline}
    >
      <div className={components.cardPaper}>
        <div
          className={`${components.cardFront}${rank === 'unique' ? ` ${components.uniqueCard}` : ''}`}
        >
          <CardHeader
            factions={factions}
            categories={categories}
            name={name}
            strength={strength}
          />

          <CardContent card={card} />

          <CardFooter cost={cost} />
        </div>
      </div>
    </div>
  )
}
