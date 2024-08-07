import { FC } from 'react'
import {
  CardHeader,
  CardContent,
  StyledCard,
  CardTitle,
  CardTypes,
  CardFlavor,
  CardFooter
} from './styles'
import { CardProps } from './types'
import { Lead } from 'src/styles'
import { getFactionColor, joinCardTypes } from '../utils'
import { PositiveNegativeNumber } from './PositiveNegativeNumber'

export const Card: FC<CardProps> = ({
  card,
  isFaceDown,
  isPlayable,
  onClick
}) => {
  const {
    name,
    strength,
    id,
    description,
    flavor,
    types,
    factions,
    cost,
    prototype
  } = card

  const onClickCard = onClick ? () => onClick(id) : undefined

  return (
    <StyledCard onClick={onClickCard} $isPlayable={isPlayable}>
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
          <CardHeader
            $factionColor={getFactionColor(factions)}
            $isPlayable={isPlayable}
          >
            <CardTitle>
              <Lead>{name}</Lead>
              <Lead>
                {strength && prototype.strength && (
                  <PositiveNegativeNumber
                    current={strength}
                    base={prototype.strength}
                  />
                )}
              </Lead>
            </CardTitle>
            <CardTypes>{joinCardTypes(types)}</CardTypes>
          </CardHeader>
          <CardContent>
            {description}
            <br />
            <CardFlavor>{flavor}</CardFlavor>
          </CardContent>
          <CardFooter>Cost: {cost}</CardFooter>
        </>
      )}
    </StyledCard>
  )
}
