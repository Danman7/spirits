import { FC } from 'react'

import { AnimatedNumber } from 'src/shared/components/AnimatedNumber'
import styles from 'src/shared/styles/components.module.css'

interface ColoredNumberProps {
  base?: number
  current?: number
}

export const ColoredNumber: FC<ColoredNumberProps> = ({
  base = 0,
  current = 0,
}) => {
  const className =
    current > base
      ? styles.positiveText
      : current < base
        ? styles.negativeText
        : ''

  return (
    <span className={className}>
      <AnimatedNumber value={current} />
    </span>
  )
}
