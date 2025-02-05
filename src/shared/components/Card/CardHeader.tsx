import {
  CardTitle,
  ColoredNumber,
  StyledCardHeader,
} from 'src/shared/components'
import { Card } from 'src/shared/types'
import {
  findCardBaseFromName,
  joinStringArrayWithComma,
} from 'src/shared/utils'

interface CardHeaderProps {
  id: string
  card: Card
}

export const CardHeader: React.FC<CardHeaderProps> = ({ card, id }) => {
  const { categories, factions, name, type } = card

  const base = findCardBaseFromName(name)

  return (
    <StyledCardHeader $factions={factions}>
      <CardTitle $text={name}>
        {name}

        {type === 'agent' && base?.type === 'agent' ? (
          <ColoredNumber
            current={card.strength}
            base={base.strength}
            uniqueId={id}
          />
        ) : null}
      </CardTitle>

      <small>{joinStringArrayWithComma(categories)}</small>
    </StyledCardHeader>
  )
}
