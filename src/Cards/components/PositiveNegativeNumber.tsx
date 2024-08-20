import { FC } from 'react'
import { NegativeText, PositiveText } from '../../styles'
import { PositiveNegativeNumberProps } from '../CardTypes'

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
