import { FC, useEffect, useRef } from 'react'

import {
  CardHeader,
  CardContent,
  StyledCard,
  CardTitle,
  CardTypes,
  CardFlavor,
  CardFooter,
  CardPaper
} from './CardStyles'
import { Lead } from '../../styles'
import { getFactionColor, joinCardTypes } from '../CardUtils'
import { PositiveNegativeNumber } from './PositiveNegativeNumber'
import { useTheme } from 'styled-components'
import {
  boostCardAnimation,
  numberChangeAnimation,
  playableCardAnimation
} from '../../utils/animations'
import { usePrevious } from '../../utils/customHooks'
import { CardProps } from '../CardTypes'

export const Card: FC<CardProps> = ({
  card,
  isFaceDown,
  isPlayable,
  onClickCard
}) => {
  const {
    name,
    strength,
    description,
    flavor,
    types,
    factions,
    cost,
    prototype,
    state
  } = card

  const theme = useTheme()

  const prevStrength = usePrevious(strength)

  const strengthElement = useRef<HTMLDivElement>(null)
  const cardElement = useRef<HTMLDivElement>(null)

  const strengthChangeAnimation = numberChangeAnimation(
    strengthElement.current,
    theme
  )

  const boostAnimation = boostCardAnimation(cardElement.current, theme)

  useEffect(() => {
    if (prevStrength !== strength) {
      strengthChangeAnimation.play()
    }

    if ((prevStrength as number) < (strength as number)) {
      boostAnimation.play()
    }
  }, [strength, strengthChangeAnimation, prevStrength, boostAnimation])

  useEffect(() => {
    playableCardAnimation(cardElement.current, theme, isPlayable)
  }, [isPlayable, theme])

  return (
    <StyledCard
      onClick={onClickCard ? () => onClickCard(card) : undefined}
      $cardState={state}
      $isFaceDown={isFaceDown}
    >
      <CardPaper ref={cardElement}>
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
                <Lead ref={strengthElement}>
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
      </CardPaper>
    </StyledCard>
  )
}
