import { FC } from 'react'
import { PositiveNegativeNumberProps } from './types'
import { NegativeText, PositiveText } from '../../styles'

export const PositiveNegativeNumber: FC<PositiveNegativeNumberProps> = ({
  base,
  current
}) => {
  if (current > base) {
    return <PositiveText>{current}</PositiveText>
  }

  if (current < base) {
    return <NegativeText>{current}</NegativeText>
  }

  return <>{current}</>
}
