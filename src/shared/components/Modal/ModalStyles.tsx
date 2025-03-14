import { AnimateStateProps } from 'src/shared/components/SharedComponentTypes'
import {
  Animated,
  Box,
  FadeIn,
  FadeOut,
  SlideIn,
  SlideOut,
} from 'src/shared/styles/GlobalStyles'
import styled from 'styled-components'

export const StyledModal = styled(Box)<AnimateStateProps>`
  z-index: 5;
  animation-duration: ${({ theme }) => theme.transitionTime};
  animation-timing-function: ease-in-out;
  animation-fill-mode: both;
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

export const Overlay = styled(Animated)<AnimateStateProps>`
  background: rgba(0, 0, 0, 0.5);
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
