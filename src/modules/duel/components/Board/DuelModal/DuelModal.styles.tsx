import styled, { keyframes } from 'styled-components'

import { Color } from 'src/shared/shared.types'
import { animationMixin, Box } from 'src/shared/styles'

export const PlayerNamesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 600px;
`

const LeftSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }

  20% {
    opacity: 1;
  }

  100% {
	  transform: translateX(10px);
  }
`

const RightSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px);
  }

  20% {
    opacity: 1;
  }

  100% {
	  transform: translateX(-10px);
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
  width: 300px;
  height: 180px;
  display: flex;
  justify-content: center;
  background-color: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.background};
  animation-delay: ${({ theme }) => theme.transitionTime}ms;
  animation-name: ${BoxGrow};
  ${animationMixin(5)}

  h2 {
    padding: 5px 0;
    width: 200px;
    animation-delay: ${({ theme }) => theme.transitionTime}ms;
    ${animationMixin(20)}
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
    transform: translate(-50%, -80%);
    opacity: 1;
  }
`

export const Versus = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -80%);
  animation-name: ${SlowPopIn};
  animation-delay: ${({ theme }) => theme.transitionTime * 5}ms;
  ${animationMixin(5)}
`

const FirstPlayerPop = keyframes`
  0% {
    opacity: 0;
    bottom: 40px;
  }

  100% {
    opacity: 1;
    bottom: 50px;
  }
`

export const FirstPlayerBox = styled(Box)`
  position: absolute;
  left: 5em;
  right: 5em;
  bottom: 70px;
  animation-delay: ${({ theme }) => theme.transitionTime * 12}ms;
  animation-name: ${FirstPlayerPop};
  ${animationMixin(2)}
`
