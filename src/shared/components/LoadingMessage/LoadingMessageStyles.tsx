import { defaultTheme } from 'src/shared/styles/DefaultTheme'
import styled, { keyframes } from 'styled-components'

const { primary } = defaultTheme.colors

const Wave = keyframes`
  from {
    transform: translateY(0);
    color: inherit;
  }

  to {
    transform: translateY(-0.5em);
    color: ${primary};
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
