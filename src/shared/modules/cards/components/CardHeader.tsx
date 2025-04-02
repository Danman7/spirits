import { ColoredNumber } from 'src/shared/components'
import type { Card } from 'src/shared/modules/cards'
import { getCardBaseFromName } from 'src/shared/modules/cards/cards.utils'
import {
  CardTitle,
  StyledCardHeader,
} from 'src/shared/modules/cards/components/Card.styles'
import { joinStringArrayWithComma } from 'src/shared/shared.utils'

interface CardHeaderProps {
  id: string
  card: Card
}

export const CardHeader: React.FC<CardHeaderProps> = ({ card, id }) => {
  const { categories, factions, name, type, isElite } = card

  const base = getCardBaseFromName(name)

  return (
    <StyledCardHeader $factions={factions} $isElite={!!isElite}>
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
