import styled from 'styled-components'

interface StyledColoredNumberProps {
  base: number
  current: number
}

export const StyledColoredNumber = styled.span<StyledColoredNumberProps>`
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  color: ${({ base, current, theme }) => {
    if (current > base) return theme.colors.action
    if (current < base) return theme.colors.primary
    return 'inherit'
  }};
`
