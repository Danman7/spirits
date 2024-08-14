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
} from './styles'
import { CardProps, CardState } from './types'
import { Lead } from '../../styles'
import { getCardPortalElements, getFactionColor, joinCardTypes } from '../utils'
import { PositiveNegativeNumber } from './PositiveNegativeNumber'
import { useTheme } from 'styled-components'
import {
  boostCardAnimation,
  numberChangeAnimation,
  playableCardAnimation
} from '../../utils/animations'
import { usePrevious } from '../../utils/customHooks'
import { createPortal } from 'react-dom'
import { useAppDispatch } from '../../state'
import { GameActions } from '../../Game/GameSlice'

export const Card: FC<CardProps> = ({
  card,
  isPlayerCard,
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
    prototype,
    state,
    onPlayAbility
  } = card

  const onClickCard = onClick ? () => onClick(id) : undefined

  const dispatch = useAppDispatch()
  const theme = useTheme()

  const prevStrength = usePrevious(strength)
  const prevState = usePrevious(state)

  const strengthElement = useRef<HTMLDivElement>(null)
  const cardElement = useRef<HTMLDivElement>(null)

  const strengthChangeAnimation = numberChangeAnimation(
    strengthElement.current,
    theme
  )

  const boostAnimation = boostCardAnimation(cardElement.current, theme)

  useEffect(() => {
    if (
      prevState === CardState.InHand &&
      state === CardState.OnBoard &&
      onPlayAbility
    ) {
      dispatch(GameActions.triggerOnPlayAbility(onPlayAbility))
    }
  }, [prevState, state, dispatch, onPlayAbility])

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

  return createPortal(
    <StyledCard
      onClick={onClickCard}
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
    </StyledCard>,
    getCardPortalElements(state, isPlayerCard)
  )
}
