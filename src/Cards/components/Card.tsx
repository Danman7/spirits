import { FC, useEffect } from 'react'

import {
  CardHeader,
  CardContent,
  StyledCard,
  CardTitle,
  CardTypes,
  CardFlavor,
  CardFooter
} from './CardStyles'
import { Lead } from '../../styles'
import { getFactionColor, joinCardTypes } from '../CardUtils'
import { PositiveNegativeNumber } from './PositiveNegativeNumber'
import { useTheme } from 'styled-components'
import { usePrevious } from '../../utils/customHooks'
import { CardProps } from '../CardTypes'

export const Card: FC<CardProps> = ({
  card,
  isSmaller,
  isFaceDown,
  isActive,
  onClickCard
}) => {
  const {
    id,
    name,
    strength,
    description,
    flavor,
    types,
    factions,
    cost,
    prototype
  } = card

  const theme = useTheme()

  const prevStrength = usePrevious(strength)

  useEffect(() => {
    if (prevStrength !== strength) {
      // TODO: strength change animation
    }

    if ((prevStrength as number) < (strength as number)) {
      // TODO: boost animation
    }
  }, [prevStrength, strength])

  useEffect(() => {
    // TODO: card active animation
  }, [isActive, theme])

  return (
    <StyledCard
      layoutId={id}
      onClick={onClickCard ? () => onClickCard(card) : undefined}
      $isSmaller={isSmaller}
      $isFaceDown={isFaceDown}
    >
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
                stroke={theme.colors.line}
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
