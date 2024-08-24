import { FC } from 'react'

import styles from '../../styles.module.css'
import { PositiveNegativeNumberProps } from '../CardTypes'

export const PositiveNegativeNumber: FC<PositiveNegativeNumberProps> = ({
  base,
  current
}) => {
  if (current > base) {
    return <div className={styles.positiveText}>{current}</div>
  }

  if (current < base) {
    return <div className={styles.negativeText}>{current}</div>
  }

  return <>{current}</>
}
