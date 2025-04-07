import styled from 'styled-components'

import { Color } from 'src/shared/shared.types'

export const StyledIcon = styled.div<{ $color: Color; $size?: string }>`
  display: inline-flex;
  align-self: center;

  & svg {
    width: ${({ $size }) => $size || '1em'};
    height: ${({ $size }) => $size || '1em'};
    top: 0.125em;
    position: relative;
  }

  & path {
    fill: ${({ $color }) => $color};
  }
`
