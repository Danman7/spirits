import { useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  useCard,
  useCardStack,
  useDefeatHandler,
  useDuelCardOnClick,
  useIsAttacking,
  useMovement,
} from 'src/modules/duel/components/DuelCard/DuelCardHooks'
import { CardMovementWrapper } from 'src/modules/duel/components/DuelCard/DuelCardStyles'
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

  const onClick = useDuelCardOnClick(cardId, playerId, stack)

  const card = useCard(cardId)

  useDefeatHandler(cardId, playerId, stack)

  const cardMovementWrapper = useRef(null)

  const { style, portal, isFaceDown, isSmall } = useMovement({
    isOnTop,
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
