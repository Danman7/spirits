import { FC } from 'react'

import { AnimatedNumber } from 'src/shared/components'
import { StyledColoredNumber } from 'src/shared/components/ColoredNumber/ColoredNumber.styles'

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
  <StyledColoredNumber $base={base} $current={current}>
    <AnimatedNumber value={current} uniqueId={uniqueId} />
  </StyledColoredNumber>
)
