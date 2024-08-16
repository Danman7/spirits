import { StyledCard } from '../../Cards/components/styles'
import styled, { css, keyframes } from 'styled-components'

export const StyledBoard = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
`
const PlayerBoard = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing}px;
  gap: ${({ theme }) => theme.spacing}px;
  z-index: 1;
`

export const TopPlayerBoard = styled(PlayerBoard)`
  border-bottom: 1px dashed ${({ theme }) => theme.colors.pale};
  align-items: flex-end;

  ${StyledCard} {
    transform-origin: bottom;
  }
`

export const BottomPlayerBoard = styled(PlayerBoard)`
  align-items: flex-start;

  ${StyledCard} {
    transform-origin: top;
  }
`

export const PlayerHand = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 2;
  flex-grow: 2;

  ${StyledCard} {
    margin: 0 -${({ theme }) => theme.cardHeight / 4}px;
  }
`

export const BottomPlayerHand = styled(PlayerHand)`
  ${StyledCard} {
    position: relative;
    bottom: 0;

    &:hover {
      bottom: 275px;
    }
  }
`

const fadeInAndOut = keyframes`
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`

interface StyledOverlayProps {
  $isAnimated?: boolean
}

export const StyledOverlay = styled.div<StyledOverlayProps>`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  animation: ${({ $isAnimated, theme }) =>
    $isAnimated
      ? css`
          ${fadeInAndOut}
          ${theme.slowAnimationDuration}ms linear forwards
        `
      : 'none'};
`

interface PlayerInfoProps {
  $isActivePlayer: boolean
}

const PlayerInfo = styled.div<PlayerInfoProps>`
  position: fixed;
  left: ${({ theme }) => theme.spacing}px;
  font-weight: ${({ $isActivePlayer }) => ($isActivePlayer ? 800 : 400)};
`

export const TopPlayerInfo = styled(PlayerInfo)`
  top: ${({ theme }) => theme.spacing}px;
`

export const BottomPlayerInfo = styled(PlayerInfo)`
  bottom: ${({ theme }) => theme.spacing}px;
`

const Button = styled.button`
  background: ${({ theme }) => theme.colors.positive};
  border: none;
  padding: ${({ theme }) => theme.spacing}px
    ${({ theme }) => theme.spacing * 2}px;
  box-shadow:
    inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),
    1px 1px 1px ${({ theme }) => theme.colors.shadow};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: all ${({ theme }) => theme.quickAnimationDuration}ms ease;
  cursor: pointer;
  transform-origin: center;

  &:hover {
    transform: scale(1.1);
    box-shadow:
      inset 3px 3px 3px 0px rgba(255, 255, 255, 0.5),
      3px 3px 3px ${({ theme }) => theme.colors.shadow};
  }

  &:active {
    transform: scale(0.95);
    box-shadow: none;
  }
`

export const EndTurnButton = styled(Button)`
  position: absolute;
  left: ${({ theme }) => theme.spacing}px;
  top: 50%;
  z-index: 3;
`

export const CoinsElement = styled.div`
  display: inline-block;
`

export const FaceDownStack = styled.div`
  width: ${({ theme }) => theme.cardWidth}px;
  height: ${({ theme }) => theme.cardHeight}px;
  position: relative;

  ${StyledCard} {
    position: absolute;
  }
`

const PlayerNonBoard = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
`

export const TopPlayerNonBoard = styled(PlayerNonBoard)`
  top: -300px;
`

export const BottomPlayerNonBoard = styled(PlayerNonBoard)`
  bottom: -275px;
`
