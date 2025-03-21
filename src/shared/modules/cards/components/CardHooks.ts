import { useEffect, useState } from 'react'
import { usePrevious } from 'src/shared/SharedHooks'
import { CardStrengthAnimateState } from 'src/shared/modules/cards/CardTypes'
import { useTheme } from 'styled-components'

export const useCardVisibility = (isFaceDown: boolean) => {
  const prevIsFaceDown = usePrevious(isFaceDown)
  const [shouldShowFront, setShouldShowFront] = useState(!isFaceDown)
  const { transitionTime } = useTheme()

  useEffect(() => {
    if (prevIsFaceDown !== isFaceDown) {
      if (isFaceDown) {
        setTimeout(() => setShouldShowFront(false), transitionTime)
      } else {
        setShouldShowFront(true)
      }
    }
  }, [isFaceDown, prevIsFaceDown, transitionTime])

  return shouldShowFront
}

export const useCardStrengthAnimation = (strength: number) => {
  const prevStrength = usePrevious(strength)
  const [state, setState] = useState<CardStrengthAnimateState>('')
  const { transitionTime } = useTheme()

  useEffect(() => {
    if (prevStrength !== undefined && prevStrength !== strength) {
      setState(prevStrength < strength ? 'boosted' : 'damaged')

      setTimeout(() => setState(''), transitionTime)
    }
  }, [strength, prevStrength, transitionTime])

  return state
}
