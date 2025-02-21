import { FC } from 'react'
import {
  useCard,
  useCardStack,
  useDefeatHandler,
  useDuelCardOnClick,
  useIsAttacking,
} from 'src/modules/duel/components/DuelCard/hooks'
import { CardComponent } from 'src/shared/modules/cards/components/Card'

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
  const stack = useCardStack(playerId, cardId)
  const isAttacking = useIsAttacking(cardId)

  const isFaceDown = isOnTop
    ? ['deck', 'discard', 'hand'].includes(stack)
    : ['deck', 'discard'].includes(stack)
  const isSmall = ['deck', 'discard', 'board'].includes(stack)

  const onClick = useDuelCardOnClick(cardId, playerId, stack)

  const card = useCard(playerId, cardId)

  useDefeatHandler(cardId, playerId, stack)

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
