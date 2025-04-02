import styled from 'styled-components'

import type { AnimateStateProps } from 'src/shared/components/sharedComponents.types'
import {
  Box,
  FadeIn,
  FadeOut,
  SlideIn,
  SlideOut,
  animationMixin,
} from 'src/shared/styles'

export const StyledModal = styled(Box)<AnimateStateProps>`
  z-index: 5;
  animation-name: ${({ $animateState }) => {
    if ($animateState === 'in') return SlideIn
    if ($animateState === 'out') return SlideOut
    return ''
  }};
  opacity: ${({ $animateState }) => ($animateState ? 1 : 0)};
`

export const ModalWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

export const Overlay = styled.div<AnimateStateProps>`
  ${animationMixin()}
  background: rgba(61, 44, 41, 0.9);
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 5;
  animation-name: fadeIn;
  animation-name: ${({ $animateState }) => {
    if ($animateState === 'in') return FadeIn
    if ($animateState === 'out') return FadeOut
    return ''
  }};
`
