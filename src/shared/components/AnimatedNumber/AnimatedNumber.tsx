import { FC, useEffect, useState } from 'react'
import { Difference, StyledAnimatedNumber } from 'src/shared/components'
import { usePrevious } from 'src/shared/customHooks'

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
          text: `${value > previousValue ? '+' : ''}${value - previousValue}`,
        },
      ])

      updateId += 1
    }
  }, [value])

  return (
    <StyledAnimatedNumber>
      <span>{value}</span>

      {updates.map(({ id, text }) => (
        <Difference
          key={uniqueId ? `${uniqueId}-update-${id}` : id}
          onAnimationEnd={() => removeUpdate(id)}
        >
          {text}
        </Difference>
      ))}
    </StyledAnimatedNumber>
  )
}
