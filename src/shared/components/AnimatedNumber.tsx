import { FC, useEffect, useState } from 'react'
import { TICK } from 'src/shared/constants'

import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'

interface AnimatedNumberProps {
  value: number
}

export const AnimatedNumber: FC<AnimatedNumberProps> = ({ value }) => {
  const previousValue = usePrevious(value)

  const [valueAnimation, setValueAnimation] = useState('')
  const [differenceAnimation, setDifferenceAnimation] = useState('')
  const [difference, setDifference] = useState('')

  useEffect(() => {
    if (previousValue !== undefined && value !== previousValue) {
      setValueAnimation('')
      setDifferenceAnimation('')
      setDifference(
        `${value > previousValue ? '+' : ''}${value - previousValue}`,
      )

      setTimeout(() => {
        setValueAnimation(animations.pop)
        setDifferenceAnimation(` ${animations.slideUpOpacity}`)
      }, TICK)
    }
  }, [previousValue, value])

  return (
    <div className={components.inlineBlock}>
      <span className={valueAnimation}>{value}</span>

      <div className={`${animations.difference}${differenceAnimation}`}>
        {difference}
      </div>
    </div>
  )
}
