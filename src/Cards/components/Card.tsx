import { FC, useEffect, useRef } from 'react'

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
import { useTheme } from 'styled-components'
import {
  boostCardAnimation,
  numberChangeAnimation,
  playableCardAnimation
} from 'src/utils/animations'
import { usePrevious } from 'src/utils/customHooks'

export const Card: FC<CardProps> = ({
  card,
  isFaceDown,
  isOnTheBoard,
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

  const theme = useTheme()

  const prevStrength = usePrevious(strength)
  const strengthElement = useRef<HTMLDivElement>(null)
  const cardElement = useRef<HTMLDivElement>(null)

  const strengthChangeAnimation = numberChangeAnimation(
    strengthElement.current,
    theme
  )

  const boostAnimation = boostCardAnimation(cardElement.current)

  const playableAnimation = playableCardAnimation(cardElement.current, theme)

  useEffect(() => {
    if (prevStrength !== strength && strengthChangeAnimation.play) {
      strengthChangeAnimation.play()
    }

    if (
      (prevStrength as number) < (strength as number) &&
      boostAnimation.play
    ) {
      boostAnimation.play()
    }
  }, [strength, strengthChangeAnimation, prevStrength, boostAnimation])

  useEffect(() => {
    if (isPlayable && playableAnimation.play) {
      playableAnimation.play()
    }
  }, [isPlayable, playableAnimation])

  return (
    <StyledCard
      onClick={onClickCard}
      ref={cardElement}
      $isOnTheBoard={isOnTheBoard}
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
    </StyledCard>
  )
}
