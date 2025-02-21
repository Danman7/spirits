import { FC, useEffect, useRef, useState } from 'react'
import {
  Difference,
  StyledAnimatedNumber,
} from 'src/shared/components/AnimatedNumber/styles'
import { usePrevious } from 'src/shared/hooks'

interface AnimatedNumberProps {
  value: number
  uniqueId?: string
}

interface ValueUpdate {
  id: number
  text: string
}

export const AnimatedNumber: FC<AnimatedNumberProps> = ({
  value,
  uniqueId,
}) => {
  const updateIdRef = useRef(0)
  const previousValue = usePrevious(value)
  const [updates, setUpdates] = useState<ValueUpdate[]>([])

  const removeUpdate = (id: number) => {
    setUpdates((prev) => prev.filter((update) => update.id !== id))
  }

  useEffect(() => {
    if (previousValue !== undefined && previousValue !== value) {
      setUpdates((prev) => [
        ...prev,
        {
          id: updateIdRef.current,
          text: `${value > previousValue ? '+' : ''}${value - previousValue}`,
        },
      ])

      updateIdRef.current += 1
    }
  }, [value, previousValue])

  return (
    <StyledAnimatedNumber>
      <span>{value}</span>

      {updates.map(({ id, text }) => (
        <Difference
          key={`${uniqueId || 'update'}-${id}`}
          onAnimationEnd={() => removeUpdate(id)}
        >
          {text}
        </Difference>
      ))}
    </StyledAnimatedNumber>
  )
}
