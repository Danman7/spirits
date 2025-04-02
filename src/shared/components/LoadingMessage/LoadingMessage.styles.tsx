import styled, { keyframes } from 'styled-components'

import { defaultTheme } from 'src/shared/styles/defaultTheme'
import { animationMixin } from 'src/shared/styles/mixins'

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
  ${animationMixin(3)}
  animation-name: ${Wave};
  animation-iteration-count: infinite;
  animation-direction: alternate;
  display: inline-block;
  margin-left: 3px;

  &:nth-child(1) {
    animation-delay: ${({ theme }) => theme.transitionTime * 1}ms;
  }

  &:nth-child(2) {
    animation-delay: ${({ theme }) => theme.transitionTime * 2}ms;
  }

  &:nth-child(3) {
    animation-delay: ${({ theme }) => theme.transitionTime * 3}ms;
  }
`
