import { useRef } from 'react'
import { createPortal } from 'react-dom'

import {
  useCard,
  useCardIndex,
  useCardStack,
  useDefeatHandler,
  useIsAttacking,
  useMovement,
  useDuelCardOnClick,
} from 'src/modules/duel/components/Board/PlayerField/PlayCard/hooks'
import { CardMovementWrapper } from 'src/modules/duel/components/Board/PlayerField/PlayCard/PlayCard.styles'

import { CardComponent } from 'src/shared/modules/cards'

interface PlayCardProps {
  cardId: string
  playerId: string
  isOnTop?: boolean
}

export const PlayCard: React.FC<PlayCardProps> = ({
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

  const cardIndex = useCardIndex(cardId, playerId, stack)

  const { style, portal, isFaceDown, isSmall } = useMovement({
    isOnTop,
    cardId,
    playerId,
    stack,
    element: cardMovementWrapper.current,
    cardIndex,
  })

  const portalElement = document.getElementById(portal)

  const cardComponent = (
    <CardMovementWrapper
      $margin={
        ['deck', 'discard'].includes(stack)
          ? isOnTop
            ? stack.length - cardIndex * 4
            : cardIndex * 4
          : 0
      }
      ref={cardMovementWrapper}
      style={style}
    >
      <CardComponent
        id={cardId}
        card={card}
        isAttacking={isAttacking}
        isFaceDown={isFaceDown}
        isSmall={isSmall}
        isAttackingFromAbove={isOnTop}
        onClick={onClick}
      />
    </CardMovementWrapper>
  )

  return process.env.NODE_ENV === 'test'
    ? createPortal(cardComponent, portalElement || document.body)
    : portalElement
      ? createPortal(cardComponent, portalElement)
      : null
}
