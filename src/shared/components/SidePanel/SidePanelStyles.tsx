import { AnimateStateProps } from 'src/shared/components/SharedComponentTypes'
import { Color } from 'src/shared/SharedTypes'
import { Box } from 'src/shared/styles/GlobalStyles'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'
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

interface PanelProps extends AnimateStateProps {
  $color: Color
}

export const Panel = styled(Box)<PanelProps>`
  width: 290px;
  padding: 1em;
  text-align: left;
  border-left-width: 3px;
  border-left-style: solid;
  border-left-color: ${({ $color, theme }) => $color || theme.colors.primary};
  z-index: 3;
  animation-name: ${({ $animateState }) => {
    if ($animateState === 'in') return SlideInFromLeft
    if ($animateState === 'out') return SlideOutToLeft
    return ''
  }};
`
