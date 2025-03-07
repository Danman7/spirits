import { ColoredNumber } from 'src/shared/components/ColoredNumber'
import {
  CardTitle,
  StyledCardHeader,
} from 'src/shared/modules/cards/components/CardStyles'
import { Card } from 'src/shared/modules/cards/CardTypes'
import { getCardBaseFromName } from 'src/shared/modules/cards/CardUtils'
import { joinStringArrayWithComma } from 'src/shared/SharedUtils'

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
