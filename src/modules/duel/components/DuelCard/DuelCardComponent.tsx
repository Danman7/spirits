import { FC } from 'react'
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
  isOnTop?: boolean
}

export const DuelCardComponent: FC<DuelCardProps> = ({
  cardId,
  playerId,
  isOnTop = false,
}) => {
  const { card, stack, isFaceDown, isSmall, isUserActive, isAttacking } =
    useDuelCardState({ cardId, playerId, isOnTop })

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
