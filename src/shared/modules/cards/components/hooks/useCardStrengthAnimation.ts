import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { CardStrengthAnimateState } from 'src/shared/modules/cards/cards.types'
import { usePrevious } from 'src/shared/usePrevious'

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
