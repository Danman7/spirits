import { FC } from 'react'
import { AnimatedNumber, StyledColoredNumber } from 'src/shared/components'

interface ColoredNumberProps {
  base: number
  current: number
  uniqueId?: string
}

export const ColoredNumber: FC<ColoredNumberProps> = ({
  base,
  current,
  uniqueId,
}) => (
  <StyledColoredNumber base={base} current={current}>
    <AnimatedNumber value={current} uniqueId={uniqueId} />
  </StyledColoredNumber>
)
