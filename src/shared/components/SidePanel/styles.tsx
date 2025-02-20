import { Box, defaultTheme } from 'src/shared/styles'
import { AnimateStateProps } from 'src/shared/types'
import styled, { keyframes } from 'styled-components'

const {
  card: { height },
} = defaultTheme

const SlideInFromLeft = keyframes`
  from {
    transform: translateX(-${height});
  }

  to {
    transform: translateX(0);
  }
`

const SlideOutToLeft = keyframes`
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-${height});
  }
`

export const Panel = styled(Box)<AnimateStateProps>`
  max-width: 280px;
  position: absolute;
  text-align: left;
  left: 1em;
  bottom: 3em;
  border-left: 3px solid var(--primary-color);
  border-left: ${({ theme }) => `3px solid ${theme.colors.primary}`};
  z-index: 3;
  animation-duration: ${({ theme }) => theme.transitionTime};
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
  animation-name: ${({ $animateState }) => {
    if ($animateState === 'in') return SlideInFromLeft
    if ($animateState === 'out') return SlideOutToLeft
    return ''
  }};
`
