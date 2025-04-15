import styled, { keyframes } from 'styled-components'

import { StyledIcon } from 'src/shared/components/Icon/Icon.styles'
import type {
  CardFaction,
  CardStrengthAnimateState,
} from 'src/shared/modules/cards/cards.types'
import { getCardFactionColor } from 'src/shared/modules/cards/cards.utils'
import {
  animationMixin,
  transitionMixin,
  defaultTheme,
  ActiveGlow,
} from 'src/shared/styles'

const { spacing } = defaultTheme

const AttackFromTopOutline = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(${spacing * 4}px);
  }
`

const AttackFromBottomOutline = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-${spacing * 4}px);
  }
`

interface CardIsSmall {
  $isSmall: boolean
}

interface AttackingProps {
  $isAttacking: boolean
  $isAttackingFromAbove: boolean
}

interface CardOutlineProps extends CardIsSmall, AttackingProps {}

export const CardOutline = styled.div<CardOutlineProps>`
  ${transitionMixin}
  width: ${({ theme, $isSmall }) => theme.card.width * ($isSmall ? 0.6 : 1)}px;
  height: ${({ theme, $isSmall }) =>
    theme.card.height * ($isSmall ? 0.6 : 1)}px;
  font-size: ${({ $isSmall }) => ($isSmall ? 0.6 : 1)}rem;
  perspective: 1000px;
  animation-iteration-count: 2;
  animation-direction: alternate;
  animation-name: ${({ $isAttacking, $isAttackingFromAbove }) => {
    if ($isAttacking && $isAttackingFromAbove) return AttackFromTopOutline
    if ($isAttacking && !$isAttackingFromAbove) return AttackFromBottomOutline
    return ''
  }};
`

interface CardPaperProps {
  $isFaceDown: boolean
}

export const CardPaper = styled.div<CardPaperProps>`
  ${transitionMixin}
  height: 100%;
  transform-style: preserve-3d;
  transition-property: transform;
  box-shadow: ${({ theme }) => theme.boxShadow.level2};
  border-radius: 0.5em;
  transform: ${({ $isFaceDown }) =>
    $isFaceDown ? 'rotateY(180deg)' : 'rotateY(0)'};
`

const CardFace = styled.div`
  backface-visibility: hidden;
  height: 100%;
  border-width: 1px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.1);
  padding: 0.5em;
  border-radius: 0.5em;
`

const { primary, hilight } = defaultTheme.colors

const AttackFromTopFace = keyframes`
  from {
    box-shadow: inherit;
  }

  to {
    box-shadow: 0 -5px 2px 2px ${primary};
  }
`

const AttackFromBottomFace = keyframes`
  from {
    box-shadow: inherit;
  }

  to {
    box-shadow: 0 5px 2px 2px ${primary};
  }
`

const Boost = keyframes`
  from {
    scale: 1;
    box-shadow: inherit;
  }

  to {
    scale: 1.1;
    box-shadow: 0 0 5px 5px ${hilight};
  }
`

const Damage = keyframes`
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(10px);
  }

  50% {
    transform: translateX(0);
  }

  75% {
    transform: translateX(-10px);
  }

  100% {
    transform: translateX(0);
  }
`

interface CardFrontProps extends AttackingProps {
  $cardStrengthAnimateState: CardStrengthAnimateState
  $isActive: boolean
}

export const CardFront = styled(CardFace)<CardFrontProps>`
  ${animationMixin(2)}
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  cursor: ${({ $isActive }) => ($isActive ? 'pointer' : 'inherit')};
  animation-iteration-count: ${({ $isActive }) => ($isActive ? 'infinite' : 2)};
  animation-direction: alternate;
  animation-name: ${({
    $isAttacking,
    $isActive,
    $isAttackingFromAbove,
    $cardStrengthAnimateState,
  }) => {
    if ($cardStrengthAnimateState === 'boosted') return Boost
    if ($cardStrengthAnimateState === 'damaged') return Damage
    if ($isActive) return ActiveGlow
    if ($isAttacking && $isAttackingFromAbove) return AttackFromTopFace
    if ($isAttacking && !$isAttackingFromAbove) return AttackFromBottomFace
    return ''
  }};
`

export const CardBack = styled(CardFace)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: rotateY(180deg);
  border: 0.25em solid ${({ theme }) => theme.colors.text};
  background: ${({ theme }) =>
    `repeating-linear-gradient(45deg, ${theme.colors.background}, ${theme.colors.background} 0.5em, ${theme.colors.text} 0.5em, ${theme.colors.text} 1em)`};
`

interface StyledCardHeaderProps {
  $factions: CardFaction[]
  $isElite: boolean
}

export const StyledCardHeader = styled.div<StyledCardHeaderProps>`
  border-radius: 0.5em;
  padding: 0.5em;
  border-bottom-width: 0.25em;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme, $isElite }) =>
    $isElite ? theme.colors.elite : theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  background: ${({ $factions }) => getCardFactionColor($factions)};
`

interface CardTitleProps {
  $text: string
}

export const CardTitle = styled.h3<CardTitleProps>`
  top: 0;
  display: flex;
  justify-content: space-between;
  font-size: ${({ $text }) => ($text.length > 20 ? '1.05em' : '1.17em')};
`

export const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: center;
  overflow: auto;
  padding: 0.5em 0;
  flex-grow: 2;
  color: ${({ theme }) => theme.colors.text};

  p {
    padding: 0 0 0.5em;
  }
`

export const StyledCardFooter = styled.div<{ $isElite: boolean }>`
  border-radius: 0.5em;
  text-align: left;
  display: flex;
  justify-content: space-between;
  bottom: 0;
  color: ${({ theme }) => theme.colors.background};
  background-color: ${({ theme, $isElite }) =>
    $isElite ? theme.colors.elite : theme.colors.text};
  color: ${({ theme }) => theme.colors.background};
  padding: 0.5em;

  ${StyledIcon} path {
    fill: ${({ theme }) => theme.colors.background};
  }
`

export const FooterSection = styled.div`
  display: inline-block;
`
