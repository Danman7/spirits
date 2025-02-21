import { ColoredNumber } from 'src/shared/components/ColoredNumber'
import {
  CardTitle,
  StyledCardHeader,
} from 'src/shared/modules/cards/components/styles'
import { Card } from 'src/shared/modules/cards/types'
import { getCardBaseFromName } from 'src/shared/modules/cards/utils'
import { joinStringArrayWithComma } from 'src/shared/utils'

interface CardHeaderProps {
  id: string
  card: Card
}

export const CardHeader: React.FC<CardHeaderProps> = ({ card, id }) => {
  const { categories, factions, name, type } = card

  const base = getCardBaseFromName(name)

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
