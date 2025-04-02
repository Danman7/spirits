import styled from 'styled-components'

export const CardMovementWrapper = styled.div<{ $margin: number }>`
  margin: ${({ $margin }) => `${$margin}px 0 0`};
`
