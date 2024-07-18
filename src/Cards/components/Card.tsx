import { FC } from 'react'
import { CardHeader, CardContent, StyledCard } from './styles'
import { CardProps } from './types'
import { Lead } from 'src/styles'

export const Card: FC<CardProps> = ({ card, isFaceDown, onClick }) => {
  const { name, strength, id } = card

  const onClickCard = onClick ? () => onClick(id) : undefined

  return (
    <StyledCard onClick={onClickCard}>
      {isFaceDown ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern
              id="pattern_rkKfx"
              patternUnits="userSpaceOnUse"
              width="12"
              height="12"
              patternTransform="rotate(45)"
            >
              <line
                x1="0"
                y="0"
                x2="0"
                y2="12"
                stroke="#999999"
                strokeWidth="8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern_rkKfx)" />
        </svg>
      ) : (
        <>
          <CardHeader>
            <Lead>{name}</Lead>
            <Lead>{strength}</Lead>
          </CardHeader>
          <CardContent />
        </>
      )}
    </StyledCard>
  )
}
