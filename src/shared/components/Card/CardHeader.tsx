import {
  CardTitle,
  ColoredNumber,
  StyledCardHeader,
} from 'src/shared/components'
import { CardBase } from 'src/shared/types'
import { joinStringArrayWithComma } from 'src/shared/utils'

interface CardHeaderProps {
  card: CardBase
  baseStrength?: number
  id?: string
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  card: { categories, factions, name, strength },
  baseStrength,
  id,
}) => (
  <StyledCardHeader $factions={factions}>
    <CardTitle $text={name}>
      {name}

      {strength && baseStrength ? (
        <ColoredNumber current={strength} base={baseStrength} uniqueId={id} />
      ) : null}
    </CardTitle>

    <small>{joinStringArrayWithComma(categories)}</small>
  </StyledCardHeader>
)
