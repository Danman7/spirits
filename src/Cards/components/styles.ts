import styled, { css } from 'styled-components'

export const StyledCard = styled.div`
  width: ${({ theme }) => theme.cardWidth}px;
  height: ${({ theme }) => theme.cardHeight}px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.line};
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'not-allowed')};
  box-shadow: 1px 1px 1px ${({ theme }) => theme.colors.line};
  transition: all ${({ theme }) => theme.animationDuration} ease;
  background-color: ${({ theme }) => theme.colors.background};
  transform-origin: top;

  ${({ onClick }) =>
    onClick &&
    css`
      &:hover {
        z-index: 2;
        transform: scale(1.01, 1.01);
        box-shadow: 3px 3px 3px ${({ theme }) => theme.colors.line};
      }
    `};

  &:active {
    transform: scale(1, 1);
    box-shadow: 0 0 1px ${({ theme }) => theme.colors.line};
  }
`

export const CardHeader = styled.div`
  padding: ${({ theme }) => theme.spacing}px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.line};
`

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing}px;
`
