import styled, { css } from 'styled-components'

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  width: ${({ theme }) => theme.cardWidth}px;
  height: ${({ theme }) => theme.cardHeight}px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.line};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')};
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.line};
  transition: all ${({ theme }) => theme.quickAnimationDuration} ease;
  background-color: ${({ theme }) => theme.colors.background};
  transform: scale(0.9, 0.9);

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        z-index: 2;
        transform: scale(1, 1);
        box-shadow: 3px 3px 3px ${({ theme }) => theme.colors.line};
      }
    `};

  &:active {
    transform: scale(0.9, 0.9);
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.line};
  }
`

interface CardHeaderProps {
  $factionColor: string
}

export const CardHeader = styled.div<CardHeaderProps>`
  padding: ${({ theme }) => theme.spacing}px;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
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
