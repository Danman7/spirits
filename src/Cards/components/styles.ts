import styled, { css } from 'styled-components'

export const StyledCard = styled.div<{ $isOnTheBoard?: boolean }>`
  width: ${({ theme }) => theme.cardWidth}px;
  height: ${({ theme }) => theme.cardHeight}px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.line};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')};
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.shadow};
  transition: all ${({ theme }) => theme.quickAnimationDuration}ms ease;
  scale: ${({ $isOnTheBoard, theme }) =>
    $isOnTheBoard ? theme.onBoardCardScale : 1};
  margin: ${({ $isOnTheBoard }) => ($isOnTheBoard ? '0 -50px' : '0')};

  &:hover {
    box-shadow: 5px 5px 5px ${({ theme }) => theme.colors.shadow};
  }

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        z-index: 2;
      }
    `};
`

export const CardPaper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`

interface CardHeaderProps {
  $factionColor: string
}

export const CardHeader = styled.div<CardHeaderProps>`
  padding: ${({ theme }) => theme.spacing}px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  color: #fff;
  background: ${({ $factionColor }) => $factionColor};
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
