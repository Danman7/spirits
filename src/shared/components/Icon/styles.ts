import styled from 'styled-components'

export const StyledIcon = styled.div<{
  $color: React.CSSProperties['fill']
  $isSmall?: boolean
}>`
  display: inline-flex;
  align-self: center;

  & svg {
    width: ${({ $isSmall }) => ($isSmall ? '1em' : '2em')};
    height: ${({ $isSmall }) => ($isSmall ? '1em' : '2em')};
    top: 0.125em;
    position: relative;
  }

  & path {
    fill: ${({ $color }) => $color};
  }
`
