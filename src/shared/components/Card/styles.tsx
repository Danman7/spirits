import { motion } from 'motion/react'
import { defaultTheme } from 'src/shared/styles'
import {
  CardFaction,
  CardRank,
  CardStrengthAnimateState,
} from 'src/shared/types'
import { getFactionColor } from 'src/shared/utils'
import styled, { keyframes } from 'styled-components'

const AttackFromTopOutline = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(25px);
  }
`

const AttackFromBottomOutline = keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-25px);
  }
`

interface CardOutlineProps {
  isSmall: boolean
  isAttacking: boolean
  isAttackingFromAbove: boolean
}

export const CardOutline = styled(motion.div)<CardOutlineProps>`
  width: ${({ isSmall }) => (isSmall ? '150px' : '250px')};
  height: ${({ isSmall }) => (isSmall ? '210px' : '350px')};
  border-radius: ${({ theme, isSmall }) =>
    isSmall ? '3px' : theme.borderRadius};
  font-size: ${({ isSmall }) => (isSmall ? '0.594rem' : '1rem')};
  perspective: 1000px;
  animation-iteration-count: 2;
  animation-direction: alternate;
  animation-duration: ${({ theme }) => theme.transitionTime};
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  animation-name: ${({ isAttacking, isAttackingFromAbove }) => {
    if (isAttacking && isAttackingFromAbove) return AttackFromTopOutline
    if (isAttacking && !isAttackingFromAbove) return AttackFromBottomOutline
    return ''
  }};
`

interface CardPaperProps {
  isSmall: boolean
  isFaceDown: boolean
}

export const CardPaper = styled(motion.div)<CardPaperProps>`
  height: 100%;
  transform-style: preserve-3d;
  transition: ${({ theme }) => `transform ${theme.pulsationTime}`};
  box-shadow: ${({ isSmall, theme }) =>
    isSmall ? theme.boxShadow.level1 : theme.boxShadow.level2};
  border-radius: ${({ theme }) => theme.borderRadius};
  transform: ${({ isFaceDown }) =>
    isFaceDown ? 'rotateY(180deg)' : 'rotateY(0)'};
`

interface CardFaceProps {
  isSmall: boolean
}

const CardFace = styled.div<CardFaceProps>`
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
  border-width: ${({ isSmall }) => (isSmall ? '1px' : '3px')};
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.borderRadius};
`

const { primary, action, hilight } = defaultTheme.colors

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

const ActiveGlow = keyframes`
  from {
    box-shadow: 0 0 2px 2px ${action}; 
  }
  to {
    box-shadow: 0 0 5px 5px ${action};
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

interface CardFrontProps extends CardOutlineProps {
  rank: CardRank
  cardStrengthAnimateState: CardStrengthAnimateState
  isActive: boolean
}

export const CardFront = styled(CardFace)<CardFrontProps>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-color: ${({ theme, rank }) =>
    rank === 'unique' ? theme.colors.hilight : theme.colors.accent};
  cursor: ${({ isActive }) => (isActive ? 'pointer' : 'inherit')};

  animation-iteration-count: ${({ isActive }) => (isActive ? 'infinite' : 2)};
  animation-direction: alternate;
  animation-duration: ${({ theme, isActive }) =>
    isActive ? theme.pulsationTime : theme.transitionTime};
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  animation-name: ${({
    isAttacking,
    isActive,
    isAttackingFromAbove,
    cardStrengthAnimateState,
  }) => {
    if (cardStrengthAnimateState === 'boosted') return Boost
    if (cardStrengthAnimateState === 'damaged') return Damage
    if (isActive) return ActiveGlow
    if (isAttacking && isAttackingFromAbove) return AttackFromTopFace
    if (isAttacking && !isAttackingFromAbove) return AttackFromBottomFace
    return ''
  }};
`

export const CardBack = styled(CardFace)`
  position: absolute;
  top: 0;
  transform: rotateY(180deg);
  background: ${({ isSmall, theme }) =>
    isSmall
      ? `repeating-linear-gradient(45deg, ${theme.colors.background}, ${theme.colors.background} 5px, ${theme.colors.accent} 5px, ${theme.colors.accent} 10px)`
      : `repeating-linear-gradient(45deg, ${theme.colors.background}, ${theme.colors.background} 10px, ${theme.colors.accent} 10px, ${theme.colors.accent} 20px)`};
`

interface StyledCardHeaderProps {
  factions: CardFaction[]
}

export const StyledCardHeader = styled.div<StyledCardHeaderProps>`
  padding: ${({ theme }) => theme.padding};
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}`};
  color: ${({ theme }) => theme.colors.background};
  border-radius: 3px 3px 0 0;
  background: ${({ factions }) => getFactionColor(factions)};
`

export const CardTitle = styled.h3`
  top: 0;
  display: flex;
  justify-content: space-between;
`

export const StyledCardContent = styled.div`
  text-align: left;
  overflow: auto;
  flex-grow: 2;
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.padding};

  p {
    margin-bottom: 0.5em;
  }
`

export const StyledCardFooter = styled.div`
  text-align: left;
  bottom: 0;
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.padding};
  border-top: ${({ theme }) => `1px solid ${theme.colors.accent}`};
`

export const CardFlavor = styled.small`
  display: block;
  font-style: italic;
  color: ${({ theme }) => theme.colors.accent};
`
