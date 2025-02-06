import { useEffect, useState } from 'react'
import { ACTION_WAIT_TIMEOUT } from 'src/shared/constants'
import { usePrevious } from 'src/shared/hooks'
import { CardStrengthAnimateState } from 'src/shared/types'

export const useCardVisibility = (isFaceDown: boolean) => {
  const prevIsFaceDown = usePrevious(isFaceDown)
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)

  useEffect(() => {
    if (prevIsFaceDown !== isFaceDown) {
      if (isFaceDown) {
        setTimeout(() => setShouldShowFront(false), 500)
      } else {
        setShouldShowFront(true)
      }
    }
  }, [isFaceDown, prevIsFaceDown])

  return shouldShowFront
}

export const useCardStrengthAnimation = (strength: number) => {
  const prevStrength = usePrevious(strength)
  const [state, setState] = useState<CardStrengthAnimateState>('')

  useEffect(() => {
    if (prevStrength !== undefined && prevStrength !== strength) {
      setState(prevStrength < strength ? 'boosted' : 'damaged')

      setTimeout(() => setState(''), ACTION_WAIT_TIMEOUT)
    }
  }, [strength, prevStrength])

  return state
}
