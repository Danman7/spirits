import styled, { css, keyframes } from 'styled-components'
import { DefaultTheme } from 'styled-components/dist/types'

interface StyledCardProps {
  $isPlayable?: boolean
}

const activeCardGlow = (theme: DefaultTheme) => keyframes`
  0% {
    box-shadow: 0 0 1px 2px ${theme.colors.active};
  }

  50% {
    box-shadow: 0 0 5px 5px ${theme.colors.active};
  }

  100% {
    box-shadow: 0 0 1px 2px ${theme.colors.active};
  }
`

export const StyledCard = styled.div<StyledCardProps>`
  display: flex;
  flex-direction: column;
  width: ${({ theme }) => theme.cardWidth}px;
  height: ${({ theme }) => theme.cardHeight}px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.line};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')};
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.shadow};
  transition: all ${({ theme }) => theme.quickAnimationDuration} ease;
  background-color: ${({ theme }) => theme.colors.background};
  transform: scale(0.9, 0.9);

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        z-index: 2;
        transform: scale(1, 1);
        box-shadow: 5px 5px 5px ${({ theme }) => theme.colors.shadow};
      }
    `};

  &:active {
    transform: scale(0.9, 0.9);
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.shadow};
  }
`

interface CardHeaderProps {
  $factionColor: string
  $isPlayable?: boolean
}

export const CardHeader = styled.div<CardHeaderProps>`
  padding: ${({ theme }) => theme.spacing}px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ $factionColor }) => $factionColor};

  animation: ${({ $isPlayable, theme }) =>
    $isPlayable
      ? css`
          ${activeCardGlow(theme)}
          ${theme.slowAnimationDuration} infinite
        `
      : 'none'};
`

export const CardFooter = styled.div`
  padding: ${({ theme }) => theme.spacing}px;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`

export const CardTitle = styled.div`
  display: flex;
  justify-content: space-between;
`

export const CardTypes = styled.div`
  display: flex;
  justify-content: center;
  font-style: italic;
  font-size: 14px;
`

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing}px;
  flex-grow: 2;
`

export const CardFlavor = styled.p`
  font-style: italic;
  font-size: 14px;
`
