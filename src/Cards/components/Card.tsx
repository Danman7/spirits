import { FC } from 'react'
import {
  CardHeader,
  CardContent,
  StyledCard,
  CardTitle,
  CardTypes,
  CardFlavor
} from './styles'
import { CardProps } from './types'
import { Lead } from 'src/styles'
import { getFactionColor, joinCardTypes } from '../utils'

export const Card: FC<CardProps> = ({ card, isFaceDown, onClick }) => {
  const { name, strength, id, description, flavor, types, factions } = card

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
                stroke={getFactionColor([factions[0]])}
                strokeWidth="8"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern_rkKfx)" />
        </svg>
      ) : (
        <>
          <CardHeader $factionColor={getFactionColor(factions)}>
            <CardTitle>
              <Lead>{name}</Lead>
              <Lead>{strength}</Lead>
            </CardTitle>
            <CardTypes>{joinCardTypes(types)}</CardTypes>
          </CardHeader>
          <CardContent>
            {description}
            <br />
            <CardFlavor>{flavor}</CardFlavor>
          </CardContent>
        </>
      )}
    </StyledCard>
  )
}
