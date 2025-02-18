import { FC } from 'react'
import { CardStack } from 'src/modules/duel'
import {
  useAttackHandler,
  useDefeatHandler,
  useDuelCardActions,
  useDuelCardState,
} from 'src/modules/duel/components'
import { CardComponent } from 'src/shared/components'

interface DuelCardProps {
  cardId: string
  playerId: string
  stack: CardStack
  isOnTop?: boolean
}

export const DuelCard: FC<DuelCardProps> = ({
  cardId,
  playerId,
  stack,
  isOnTop = false,
}) => {
  const { card, isFaceDown, isSmall, isUserActive, isAttacking } =
    useDuelCardState({ cardId, playerId, stack, isOnTop })

  const { cost, type } = card

  const onClick = useDuelCardActions({
    cardId,
    playerId,
    stack,
    isUserActive,
    cost,
  })

  useAttackHandler(cardId, playerId, isAttacking)
  useDefeatHandler(
    cardId,
    playerId,
    stack,
    type === 'agent' ? card.strength : 0,
  )

  return (
    <CardComponent
      id={cardId}
      card={card}
      isAttacking={isAttacking}
      isFaceDown={isFaceDown}
      isSmall={isSmall}
      isAttackingFromAbove={isOnTop}
      onClick={onClick}
    />
  )
}
