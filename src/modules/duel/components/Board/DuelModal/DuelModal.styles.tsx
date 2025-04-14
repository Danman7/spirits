import styled, { keyframes } from 'styled-components'

import { Color } from 'src/shared/shared.types'
import { animationMixin, Box, defaultTheme } from 'src/shared/styles'

const { spacing } = defaultTheme

export const PlayerNamesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 600px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.spacing}px;
`

const LeftSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-${spacing * 20}px);
  }

  100% {
    opacity: 1;
	  transform: translateX(0);
  }
`

const RightSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(${spacing * 20}px);
  }

  100% {
    opacity: 1;
	  transform: translateX(0);
  }
`

const BoxGrow = keyframes`
 0% {
    width: 1%;
  }

  100% {
	  width: 50%;
  }
`

const PlayerNameBox = styled.div<{ $color: Color }>`
  width: 50%;
  height: ${({ theme }) => theme.spacing * 16}px;
  display: flex;
  justify-content: center;
  background-color: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.background};
  animation-delay: ${({ theme }) => theme.transitionTime}ms;
  animation-name: ${BoxGrow};
  white-space: nowrap;
  ${animationMixin(5)}

  h2 {
    animation-delay: ${({ theme }) => theme.transitionTime}ms;
    ${animationMixin(12)}
  }
`

export const LeftPlayerName = styled(PlayerNameBox)`
  clip-path: polygon(0 0, 100% 0, 50% 100%, 0% 100%);

  h2 {
    animation-name: ${LeftSlide};
  }
`

export const RightPlayerName = styled(PlayerNameBox)`
  clip-path: polygon(50% 0, 100% 0, 100% 100%, 0 100%);
  align-items: flex-end;

  h2 {
    animation-name: ${RightSlide};
  }
`

const SlowPopIn = keyframes`
  0% {
    transform: translate(-50%, 0%);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%);
    opacity: 1;
  }
`

export const Versus = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -50%);
  animation-name: ${SlowPopIn};
  animation-delay: ${({ theme }) => theme.transitionTime * 5}ms;
  ${animationMixin(5)}
`

const FirstPlayerPop = keyframes`
  0% {
    opacity: 0;
    bottom: -${spacing * 6}px;
  }

  100% {
    opacity: 1;
    bottom: -${spacing * 5}px;
  }
`

export const FirstPlayerBox = styled(Box)`
  position: absolute;
  left: 0;
  right: 0;
  height: ${({ theme }) => theme.spacing * 2}ms;
  animation-delay: ${({ theme }) => theme.transitionTime * 12}ms;
  animation-name: ${FirstPlayerPop};
  ${animationMixin(2)}
`
