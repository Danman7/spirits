import { FC } from 'react'
import { AnimatedNumber } from 'src/shared/components'
import styles from 'src/shared/styles/components.module.css'

interface ColoredNumberProps {
  base: number
  current: number
  uniqueId?: string
}

export const ColoredNumber: FC<ColoredNumberProps> = ({
  base,
  current,
  uniqueId,
}) => {
  const className =
    current > base
      ? styles.positiveText
      : current < base
        ? styles.negativeText
        : ''

  return (
    <span className={className}>
      <AnimatedNumber value={current} uniqueId={uniqueId} />
    </span>
  )
}
