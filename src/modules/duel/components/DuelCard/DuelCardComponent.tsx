import { useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  useCard,
  useCardStack,
  useDefeatHandler,
  useDuelCardOnClick,
  useIsAttacking,
  useMovement,
} from 'src/modules/duel/components/DuelCard/hooks'
import { CardMovementWrapper } from 'src/modules/duel/components/DuelCard/styles'
import { CardComponent } from 'src/shared/modules/cards/components/Card'

interface DuelCardProps {
  cardId: string
  playerId: string
  isOnTop?: boolean
}

export const DuelCardComponent: React.FC<DuelCardProps> = ({
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

  const cardMovementWrapper = useRef(null)

  const { style, portal } = useMovement({
    cardId,
    playerId,
    stack,
    element: cardMovementWrapper.current,
  })

  return createPortal(
    <CardMovementWrapper ref={cardMovementWrapper} style={style}>
      <CardComponent
        id={cardId}
        card={card}
        isAttacking={isAttacking}
        isFaceDown={isFaceDown}
        isSmall={isSmall}
        isAttackingFromAbove={isOnTop}
        onClick={onClick}
      />
    </CardMovementWrapper>,
    document.getElementById(portal) || document.body,
  )
}
