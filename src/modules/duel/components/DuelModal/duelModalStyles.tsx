import { Color } from 'src/shared/SharedTypes'
import { Box } from 'src/shared/styles/GlobalStyles'
import styled, { keyframes } from 'styled-components'

export const PlayerNamesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 600px;
`

const LeftSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }

  20% {
    transform: translateX(-50px);
    opacity: 1;
  }

  100% {
	transform: translateX(0);
  }
`

const RightSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100px);
  }

  20% {
    transform: translateX(50px);
    opacity: 1;
  }

  100% {
	transform: translateX(0);
  }
`

const BoxGrow = keyframes`
 0% {
    width: 1px;
  }

  100% {
	  width: 300px;
  }
`

const PlayerNameBox = styled.div<{ $color: Color }>`
  width: 300px;
  height: 180px;
  display: flex;
  justify-content: center;
  background-color: ${({ $color }) => $color};
  color: ${({ theme }) => theme.colors.background};
  animation-delay: 300ms;
  animation-name: ${BoxGrow};
  animation-duration: 1s;
  animation-fill-mode: both;

  h2 {
    padding: 5px 0;
    width: 200px;
    animation-delay: 300ms;
    animation-duration: 5s;
    animation-timing-function: linear;
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
    transform: translate(-50%, -75%);
    opacity: 1;
  }
`

export const Versus = styled.h1`
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: center center;
  transform: translate(-50%, -75%);
  animation-delay: 1s;
  animation-name: ${SlowPopIn};
  animation-duration: 1s;
  animation-fill-mode: both;
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
  bottom: 50px;
  animation-delay: 2.5s;
  animation-name: ${FirstPlayerPop};
  animation-duration: 500ms;
  animation-fill-mode: both;
`
