import styled, { keyframes } from 'styled-components'

import { AnimateStateProps } from 'src/shared/components/sharedComponents.types'
import { Color } from 'src/shared/shared.types'
import { Box } from 'src/shared/styles/GlobalStyles'

const SlideInFromLeft = keyframes`
  from {
    transform: translateX(-100%);
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
    transform: translateX(-100%);
  }
`

interface PanelProps extends AnimateStateProps {
  $color: Color
}

export const Panel = styled(Box)<PanelProps>`
  width: ${({ theme }) => theme.spacing * 32}px;
  padding: 1em;
  text-align: left;
  border-left-width: ${({ theme }) => theme.spacing / 2}px;
  border-left-style: solid;
  border-left-color: ${({ $color, theme }) => $color || theme.colors.primary};
  z-index: 3;
  animation-name: ${({ $animateState }) => {
    if ($animateState === 'in') return SlideInFromLeft
    if ($animateState === 'out') return SlideOutToLeft
    return ''
  }};
`
