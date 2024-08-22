import { motion } from 'framer-motion'
import styled, { css } from 'styled-components'

export const StyledCard = styled(motion.div)<{
  $isFaceDown?: boolean
  $isSmaller?: boolean
}>`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  width: ${({ theme, $isSmaller }) => ($isSmaller ? 150 : theme.cardWidth)}px;
  height: ${({ theme, $isSmaller }) => ($isSmaller ? 210 : theme.cardHeight)}px;
  font-size: ${({ $isSmaller }) => ($isSmaller ? 10 : 16)}px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.line};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')};
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.shadow};

  ${({ $isFaceDown }) =>
    !$isFaceDown &&
    css`
      &:hover {
        box-shadow: 5px 5px 5px ${({ theme }) => theme.colors.shadow};
      }
    `};

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        z-index: 2;
      }
    `};
`

interface CardHeaderProps {
  $factionColor: string
}

export const CardHeader = styled.div<CardHeaderProps>`
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  color: #fff;
  background: ${({ $factionColor }) => $factionColor};
`

export const CardFooter = styled.div`
  bottom: 0;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
`

export const CardTitle = styled.div`
  top: 0;
  display: flex;
  justify-content: space-between;
`

export const CardTypes = styled.div`
  display: flex;
  justify-content: center;
  font-style: italic;
  font-size: 0.875em;
`

export const CardContent = styled.div`
  overflow: auto;
  padding: 0.5em;
  flex-grow: 2;
`

export const CardFlavor = styled.div`
  font-style: italic;
  font-size: 0.875em;
`
