import { motion } from 'motion/react'
import { FC } from 'react'

import components from 'src/shared/styles/components.module.css'
import { CARD_TEST_ID } from 'src/shared/testIds'
import { CardBase } from 'src/shared/types'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'

export interface CardProps {
  card: CardBase
}

export const Card: FC<CardProps> = ({ card }) => {
  const {
    name,
    description,
    flavor,
    categories,
    factions,
    cost,
    rank,
    strength,
  } = card

  return (
    <motion.div
      data-testid={`${CARD_TEST_ID}${name}`}
      className={components.cardOutline}
    >
      <div className={components.cardPaper}>
        <div
          className={`${components.cardFront}${rank === 'unique' ? ` ${components.uniqueCard}` : ''}`}
        >
          <div
            className={components.cardHeader}
            style={{ background: getFactionColor(factions) }}
          >
            <h3 className={components.cardTitle}>
              {name}
              <span>{strength}</span>
            </h3>

            <small>{joinCardCategories(categories)}</small>
          </div>
          <div className={components.cardContent}>
            {description.map((paragraph, index) => (
              <p key={`description-${index}`}>{paragraph}</p>
            ))}

            <div className={components.cardFlavor}>
              <small>{flavor}</small>
            </div>
          </div>
          <div className={components.cardFooter}>Cost: {cost}</div>
        </div>
      </div>
    </motion.div>
  )
}
