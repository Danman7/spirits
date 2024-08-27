import { FC } from 'react'

import styles from 'src/shared/styles/styles.module.css'

interface PositiveNegativeNumberProps {
  base: number
  current: number
}

const PositiveNegativeNumber: FC<PositiveNegativeNumberProps> = ({
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

export default PositiveNegativeNumber
