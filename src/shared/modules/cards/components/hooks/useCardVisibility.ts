import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { usePrevious } from 'src/shared/usePrevious'

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
