import {
  CardFaction,
  CardStrengthAnimateState,
} from 'src/shared/modules/cards/CardTypes'
import { getCardFactionColor } from 'src/shared/modules/cards/CardUtils'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'
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

interface CardIsSmall {
  $isSmall: boolean
}

interface AttackingProps {
  $isAttacking: boolean
  $isAttackingFromAbove: boolean
}

interface CardOutlineProps extends CardIsSmall, AttackingProps {}

export const CardOutline = styled.div<CardOutlineProps>`
  width: ${({ theme }) => theme.card.width};
  height: ${({ theme }) => theme.card.height};
  border-radius: ${({ theme }) => theme.borderRadius};
  scale: ${({ $isSmall }) => ($isSmall ? '0.6' : '1')};
  perspective: 1000px;
  animation-iteration-count: 2;
  animation-direction: alternate;
  animation-duration: ${({ theme }) => theme.transitionTime};
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
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
  height: 100%;
  transform-style: preserve-3d;
  transition: ${({ theme }) => `transform ${theme.pulsationTime}`};
  box-shadow: ${({ theme }) => theme.boxShadow.level2};
  border-radius: ${({ theme }) => theme.borderRadius};
  transform: ${({ $isFaceDown }) =>
    $isFaceDown ? 'rotateY(180deg)' : 'rotateY(0)'};
`

const CardFace = styled.div`
  backface-visibility: hidden;
  width: 100%;
  height: 100%;
  border-width: 3px;
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

interface CardFrontProps extends AttackingProps {
  $cardStrengthAnimateState: CardStrengthAnimateState
  $isActive: boolean
  $isUnique?: boolean
}

export const CardFront = styled(CardFace)<CardFrontProps>`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-color: ${({ theme, $isUnique }) =>
    $isUnique ? theme.colors.hilight : theme.colors.accent};
  cursor: ${({ $isActive }) => ($isActive ? 'pointer' : 'inherit')};

  animation-iteration-count: ${({ $isActive }) => ($isActive ? 'infinite' : 2)};
  animation-direction: alternate;
  animation-duration: ${({ theme, $isActive }) =>
    $isActive ? theme.pulsationTime : theme.transitionTime};
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
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
  transform: rotateY(180deg);
  background: ${({ theme }) =>
    `repeating-linear-gradient(45deg, ${theme.colors.background}, ${theme.colors.background} 10px, ${theme.colors.accent} 10px, ${theme.colors.accent} 20px)`};
`

interface StyledCardHeaderProps {
  $factions: CardFaction[]
}

export const StyledCardHeader = styled.div<StyledCardHeaderProps>`
  padding: ${({ theme }) => theme.padding};
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.accent}`};
  color: ${({ theme }) => theme.colors.background};
  border-radius: 3px 3px 0 0;
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
  display: flex;
  justify-content: space-between;
  bottom: 0;
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.padding};
  border-top: ${({ theme }) => `1px solid ${theme.colors.accent}`};
`

export const FooterSection = styled.div`
  display: inline-block;
`
