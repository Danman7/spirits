import { FC } from 'react'
import { ColoredNumber } from 'src/shared/components'
import components from 'src/shared/styles/components.module.css'
import { CardBase } from 'src/shared/types'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'

interface CardHeaderProps {
  card: CardBase
  baseStrength?: number
  id?: string
}

export const CardHeader: FC<CardHeaderProps> = ({ card, baseStrength, id }) => {
  const { categories, factions, name, strength } = card

  return (
    <div
      className={components.cardHeader}
      style={{ background: getFactionColor(factions) }}
    >
      <h3 className={components.cardTitle}>
        {name}

        {strength && baseStrength ? (
          <ColoredNumber current={strength} base={baseStrength} uniqueId={id} />
        ) : null}
      </h3>

      <small>{joinCardCategories(categories)}</small>
    </div>
  )
}
