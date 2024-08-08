import { FC, useEffect, useRef } from 'react'
import anime from 'animejs/lib/anime.es.js'

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

  const prevStrength = useRef(strength).current
  const strengthElement = useRef<HTMLDivElement>(null)
  const cardElement = useRef<HTMLDivElement>(null)

  const strengthChange = anime({
    targets: strengthElement.current,
    scale: [1, 2, 1],
    loop: 3,
    autoplay: false
  })

  const boostAnimation = anime({
    targets: cardElement.current,
    scale: [1, 1.1, 1],
    autoplay: false
  })

  const playableAnimation = anime({
    targets: cardElement.current,
    boxShadow: [
      `0 0 2px 2px ${theme.colors.positive}`,
      `0 0 4px 4px ${theme.colors.positive}`,
      `0 0 2px 2px ${theme.colors.positive}`
    ],
    duration: theme.slowAnimationDuration,
    loop: true,
    autoplay: false
  })

  useEffect(() => {
    if ((prevStrength as number) < (strength as number)) {
      strengthChange.play()
      boostAnimation.play()
    }
  }, [strength, strengthChange, prevStrength, boostAnimation])

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
