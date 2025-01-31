import { FC } from 'react'
import {
  CardTitle,
  ColoredNumber,
  StyledCardHeader,
} from 'src/shared/components'
import { CardBase } from 'src/shared/types'
import { joinCardCategories } from 'src/shared/utils'

interface CardHeaderProps {
  card: CardBase
  baseStrength?: number
  id?: string
}

export const CardHeader: FC<CardHeaderProps> = ({ card, baseStrength, id }) => {
  const { categories, factions, name, strength } = card

  return (
    <StyledCardHeader factions={factions}>
      <CardTitle>
        {name}

        {strength && baseStrength ? (
          <ColoredNumber current={strength} base={baseStrength} uniqueId={id} />
        ) : null}
      </CardTitle>

      <small>{joinCardCategories(categories)}</small>
    </StyledCardHeader>
  )
}
