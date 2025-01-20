import { FC } from 'react'
import { ColoredNumber } from 'src/shared/components'
import components from 'src/shared/styles/components.module.css'
import { CardCategory, CardFaction } from 'src/shared/types'
import { getFactionColor, joinCardCategories } from 'src/shared/utils'

interface CardHeaderProps {
  categories: CardCategory[]
  factions: CardFaction[]
  name: string
  strength?: number
  baseStrength?: number
}

export const CardHeader: FC<CardHeaderProps> = ({
  categories,
  factions,
  name,
  strength,
  baseStrength,
}) => (
  <div
    className={components.cardHeader}
    style={{ background: getFactionColor(factions) }}
  >
    <h3 className={components.cardTitle}>
      {name}

      {strength && baseStrength ? (
        <ColoredNumber current={strength} base={baseStrength} />
      ) : (
        <span>{strength}</span>
      )}
    </h3>

    <small>{joinCardCategories(categories)}</small>
  </div>
)
