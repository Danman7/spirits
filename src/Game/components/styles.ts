import { StyledCard } from 'src/Cards/components/styles'
import styled, { css, keyframes } from 'styled-components'
import { OverlayProps } from './Overlay'

export const StyledBoard = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
`
const PlayField = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing}px;
  gap: ${({ theme }) => theme.spacing}px;

  ${StyledCard} {
    transform: scale(0.7);
  }
`

export const TopPlayField = styled(PlayField)`
  border-bottom: 1px dashed ${({ theme }) => theme.colors.pale};
  align-items: flex-end;

  ${StyledCard} {
    transform-origin: bottom;
  }
`

export const BottomPlayField = styled(PlayField)`
  align-items: flex-start;

  ${StyledCard} {
    transform-origin: top;
  }
`

const PlayerDeck = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: fixed;
  left: 0;
  right: 0;

  ${StyledCard} {
    margin: -${({ theme }) => theme.cardHeight / 4}px;
  }
`

export const TopPlayerDeck = styled(PlayerDeck)`
  top: -200px;
`

export const BottomPlayerDeck = styled(PlayerDeck)`
  bottom: 0;

  ${StyledCard} {
    margin-bottom: -300px;

    &:hover {
      margin-bottom: 0;
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

export const StyledOverlay = styled.div<OverlayProps>`
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${({ isAnimated, theme }) =>
    isAnimated
      ? css`
          ${fadeInAndOut}
          ${theme.slowAnimationDuration} linear forwards
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
