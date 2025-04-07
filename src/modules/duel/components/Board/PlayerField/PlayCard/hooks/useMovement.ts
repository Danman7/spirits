import { useEffect, useLayoutEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import {
  getIsFaceDown,
  getIsSmall,
} from 'src/modules/duel/components/Board/PlayerField/PlayCard/PlayCard.utils'
import { CardStack } from 'src/modules/duel/state'

import { getIsTest } from 'src/shared/shared.utils'
import { usePrevious } from 'src/shared/usePrevious'

type MovementState = 'first' | 'last' | 'invert'

const isTest = getIsTest()

export const useMovement = ({
  isOnTop,
  stack,
  playerId,
  cardId,
  element,
  cardIndex,
}: {
  isOnTop: boolean
  stack: CardStack
  playerId: string
  cardId: string
  element: HTMLDivElement | null
  cardIndex: number
}) => {
  const [portal, setPortal] = useState(`${playerId}-${stack}`)
  const [oldRect, setOldRect] = useState<DOMRect | null>(null)
  const [movingState, setMovingState] = useState<MovementState>('first')
  const [style, setStyle] = useState<React.CSSProperties>({})
  const [isFaceDown, setIsFaceDown] = useState(getIsFaceDown(isOnTop, stack))
  const [isSmall, setIsSmall] = useState(getIsSmall(stack))

  const { transitionTime } = useTheme()
  const oldStack = usePrevious(stack)

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
      transform: `translate(${oldRect.x - newRect.x}px, ${oldRect.y - newRect.y}px)`,
    })

    if (isTest) return setMovingState('invert')

    requestAnimationFrame(() => setMovingState('invert'))
  }, [cardId, element, movingState, oldRect])

  useEffect(() => {
    if (movingState !== 'invert') return

    const updateCardState = () => {
      setIsSmall(getIsSmall(stack))
      setIsFaceDown(getIsFaceDown(isOnTop, stack))
    }

    setStyle((prevStyle) => ({
      ...prevStyle,
      zIndex: 2,
      transform: 'translate(0, 0)',
      transitionProperty: 'all',
      transitionTimingFunction: 'ease',
      transitionDuration: `${transitionTime}ms`,
      transitionDelay: `${stack === 'hand' ? cardIndex * (transitionTime / 4) : 0}ms`,
    }))

    if (isTest) {
      updateCardState()
    } else {
      setTimeout(
        () => {
          updateCardState()
        },
        (cardIndex + 1) * (transitionTime / 4),
      )
    }

    setTimeout(() => {
      setMovingState('first')
      setStyle({})
    }, transitionTime * 2)
  }, [isOnTop, stack, movingState, transitionTime, cardIndex])

  return { style, portal, isFaceDown, isSmall }
}
