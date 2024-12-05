import { FC, useEffect, useState } from 'react'

import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'

interface AnimatedNumberProps {
  value?: number
}

export const AnimatedNumber: FC<AnimatedNumberProps> = ({ value = 0 }) => {
  const previousValue = usePrevious(value)

  const [difference, setDifference] = useState('')

  const onDifferenceAnimationEnd = () => {
    setDifference('')
  }

  useEffect(() => {
    if (previousValue !== undefined && value !== previousValue) {
      setDifference(
        `${value > previousValue ? '+' : ''}${value - previousValue}`,
      )
    }
  }, [value, previousValue])

  return (
    <div className={components.inlineBlock}>
      <span key={value} className={animations.pop}>
        {value}
      </span>

      <div
        key={difference}
        className={animations.slideUpOpacity}
        onAnimationEnd={onDifferenceAnimationEnd}
      >
        {difference}
      </div>
    </div>
  )
}
