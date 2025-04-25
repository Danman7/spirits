import styled, { keyframes } from 'styled-components'

import { animationMixin } from 'src/shared/styles'

export const StyledAnimatedNumber = styled.div`
  display: inline-block;
  position: relative;
`

const slideUpOpacity = keyframes`
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateY(-2.5em);
  }
`

export const Difference = styled.div`
  ${animationMixin(20)}
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: 1px 1px 2px ${({ theme }) => theme.colors.background};
  position: absolute;
  top: -1em;
  opacity: 0;
  pointer-events: none;
  animation-name: ${slideUpOpacity};
`
