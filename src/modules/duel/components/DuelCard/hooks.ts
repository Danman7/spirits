import { useEffect, useLayoutEffect, useState } from 'react'
import { useDuel } from 'src/modules/duel/state/DuelContext'
import { CardStack } from 'src/modules/duel/types'
import { usePrevious } from 'src/shared/hooks'
import { Agent } from 'src/shared/modules/cards/types'
import { useUser } from 'src/shared/modules/user/state/UserContext'

export const useCard = (playerId: string, cardId: string) => {
  const {
    state: { players },
  } = useDuel()

  return players[playerId].cards[cardId]
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
      players,
      phase,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  const { state: user } = useUser()
  const { id: userId } = user

  const { hasPerformedAction, coins, cards } = players[playerId]
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
    state: { players },
    dispatch,
  } = useDuel()

  const { cards, discard } = players[playerId]
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

  /**
   * Step 1: Capture the old position before React updates the DOM
   */
  useLayoutEffect(() => {
    if (!oldStack || oldStack === stack || !element) return

    // Hide the element during movement to prevent flicker
    setStyle({ visibility: 'hidden' })

    // Capture old position
    setOldRect(element.getBoundingClientRect())

    // Move to new portal
    setPortal(`${playerId}-${stack}`)

    // Wait for the next frame before proceeding
    requestAnimationFrame(() => setMovingState('last'))
  }, [cardId, playerId, stack, element, oldStack])

  /**
   * Step 2: Capture the new position AFTER React has moved the element
   */
  useLayoutEffect(() => {
    if (movingState !== 'last' || !oldRect || !element) return

    const newRect = element.getBoundingClientRect()
    if (!newRect) return

    // Apply initial transform to make it look like it's in the old position
    setStyle({
      visibility: 'visible',
      transform: `translate(${oldRect.left - newRect.left}px, ${oldRect.top - newRect.top}px)`,
    })

    // Move to 'invert' in the next frame
    requestAnimationFrame(() => setMovingState('invert'))
  }, [cardId, element, movingState, oldRect])

  /**
   * Step 3: Transition to the new position smoothly
   */
  useEffect(() => {
    if (movingState !== 'invert') return

    setStyle((prevStyle) => ({
      ...prevStyle,
      transform: `translate(0, 0)`,
      transition: 'transform 0.3s ease',
    }))

    // Reset back to 'first' after animation completes
    setTimeout(() => setMovingState('first'), 300)
  }, [movingState])

  return { style, portal }
}
