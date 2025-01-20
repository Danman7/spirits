import { FC } from 'react'
import { AnimatedNumber } from 'src/shared/components'
import styles from 'src/shared/styles/components.module.css'

interface ColoredNumberProps {
  base: number
  current: number
}

export const ColoredNumber: FC<ColoredNumberProps> = ({ base, current }) => {
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
