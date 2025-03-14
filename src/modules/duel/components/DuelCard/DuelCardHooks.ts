import { useEffect, useLayoutEffect, useState } from 'react'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { CardStack } from 'src/modules/duel/state/duelStateTypes'
import { usePrevious } from 'src/shared/SharedHooks'
import { Agent } from 'src/shared/modules/cards/CardTypes'
import { useUser } from 'src/shared/modules/user/state/UserContext'

export const useCard = (cardId: string) => {
  const {
    state: { cards },
  } = useDuel()

  return cards[cardId]
}

export const useCardStack = (playerId: string, cardId: string): CardStack => {
  const {
    state: { players },
  } = useDuel()

  const { hand, deck, board } = players[playerId]

  if (hand.includes(cardId)) return 'hand'
  if (deck.includes(cardId)) return 'deck'
  if (board.includes(cardId)) return 'board'

  return 'discard'
}

export const useIsAttacking = (cardId: string) => {
  const {
    state: { attackingQueue },
  } = useDuel()

  return cardId === attackingQueue[0]?.attackerId
}

export const useDuelCardOnClick = (
  cardId: string,
  playerId: string,
  stack: CardStack,
) => {
  const {
    state: {
      cards,
      players,
      phase,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  const { state: user } = useUser()
  const { id: userId } = user

  const { hasPerformedAction, coins } = players[playerId]
  const { cost } = cards[cardId]

  if (stack === 'hand' && !hasPerformedAction) {
    if (
      phase === 'Player Turn' &&
      playerId === userId &&
      playerId === activePlayerId &&
      cost <= coins
    ) {
      return () =>
        dispatch({ type: 'PLAY_CARD', cardId, playerId, shouldPay: true })
    }

    if (phase === 'Redrawing') {
      return () => {
        dispatch({ type: 'REDRAW_CARD', cardId, playerId })
      }
    }
  }

  return undefined
}

export const useDefeatHandler = (
  cardId: string,
  playerId: string,
  stack: CardStack,
) => {
  const {
    state: { players, cards },
    dispatch,
  } = useDuel()

  const { discard } = players[playerId]
  const card = cards[cardId] as Agent

  useEffect(() => {
    if (stack !== 'board' || card.strength > 0 || discard.includes(cardId))
      return

    dispatch({ type: 'DISCARD_CARD', cardId, playerId })
  }, [cardId, playerId, stack, card.strength, card.type, discard, dispatch])
}

type MovementState = 'first' | 'last' | 'invert'

export const useMovement = ({
  stack,
  playerId,
  cardId,
  element,
}: {
  stack: CardStack
  playerId: string
  cardId: string
  element: HTMLDivElement | null
}) => {
  const oldStack = usePrevious(stack)

  const [portal, setPortal] = useState(`${playerId}-${stack}`)
  const [oldRect, setOldRect] = useState<DOMRect | null>(null)
  const [movingState, setMovingState] = useState<MovementState>('first')
  const [style, setStyle] = useState<React.CSSProperties>({})

  useLayoutEffect(() => {
    if (!oldStack || oldStack === stack || !element) return

    setStyle({ visibility: 'hidden' })

    setOldRect(element.getBoundingClientRect())

    setPortal(`${playerId}-${stack}`)

    requestAnimationFrame(() => setMovingState('last'))
  }, [cardId, playerId, stack, element, oldStack])

  useLayoutEffect(() => {
    if (movingState !== 'last' || !oldRect || !element) return

    const newRect = element.getBoundingClientRect()
    if (!newRect) return

    setStyle({
      visibility: 'visible',
      transform: `translate(${oldRect.left - newRect.left}px, ${oldRect.top - newRect.top}px)`,
    })

    requestAnimationFrame(() => setMovingState('invert'))
  }, [cardId, element, movingState, oldRect])

  useEffect(() => {
    if (movingState !== 'invert') return

    setStyle((prevStyle) => ({
      ...prevStyle,
      transform: 'translate(0, 0)',
      transition: 'transform 0.3s ease',
    }))

    setTimeout(() => setMovingState('first'), 300)
  }, [movingState])

  return { style, portal }
}
