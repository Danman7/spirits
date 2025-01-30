import { FC, useEffect, useState } from 'react'
import { usePrevious } from 'src/shared/customHooks'
import animations from 'src/shared/styles/animations.module.css'
import components from 'src/shared/styles/components.module.css'

interface AnimatedNumberProps {
  value: number
  uniqueId?: string
}

let updateId = 0

export const AnimatedNumber: FC<AnimatedNumberProps> = ({
  value,
  uniqueId,
}) => {
  const previousValue = usePrevious(value)

  const [updates, setUpdates] = useState<
    {
      id: number
      text: string
    }[]
  >([])

  const removeUpdate = (updateId: number) =>
    setUpdates(updates.filter(({ id }) => id !== updateId))

  useEffect(() => {
    if (previousValue !== value) {
      setUpdates([
        ...updates,
        {
          id: updateId,
          text: `${value > previousValue ? '+ ' : '- '}${value - previousValue}`,
        },
      ])

      updateId += 1
    }
  }, [value])

  return (
    <div className={components.inlineBlock}>
      <span>{value}</span>

      {updates.map(({ id, text }) => (
        <div
          key={uniqueId ? `${uniqueId}-update-${id}` : id}
          onAnimationEnd={() => removeUpdate(id)}
          className={`${animations.difference} ${animations.slideUpOpacity}`}
        >
          {text}
        </div>
      ))}
    </div>
  )
}
