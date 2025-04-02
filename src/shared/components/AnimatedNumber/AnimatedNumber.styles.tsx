import styled, { keyframes } from 'styled-components'

import { animationMixin } from 'src/shared/styles'

export const StyledAnimatedNumber = styled.div`
  display: inline-block;
`

const slideUpOpacity = keyframes`
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
    transform: translateY(-1em);
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-2em);
  }
`

export const Difference = styled.div`
  ${animationMixin(20)}
  position: absolute;
  top: 0;
  opacity: 0;
  pointer-events: none;
  animation-name: ${slideUpOpacity};
`
