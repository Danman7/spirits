import { defaultTheme } from 'src/shared/styles'
import styled, { keyframes } from 'styled-components'

const { hilight } = defaultTheme.colors

const Wave = keyframes`
  from {
    scale: 1;
    box-shadow: inherit;
  }

  to {
    scale: 1.1;
    box-shadow: 0 0 5px 5px ${hilight};
  }
`

export const LoadingDot = styled.div`
  animation-duration: ${({ theme }) => theme.pulsationTime};
  animation-timing-function: ease-in-out;
  animation-name: ${Wave};
  animation-iteration-count: infinite;
  animation-direction: alternate;
  display: inline-block;
  margin-left: 3px;

  &:nth-child(2) {
    animation-delay: ${({ theme }) => `calc(${theme.transitionTime} * 1)`};
  }

  &:nth-child(3) {
    animation-delay: ${({ theme }) => `calc(${theme.transitionTime} * 2)`};
  }

  &:nth-child(4) {
    animation-delay: ${({ theme }) => `calc(${theme.transitionTime} * 3)`};
  }
`
