import { StyledCard } from 'src/Cards/components/styles'
import styled, { keyframes } from 'styled-components'

export const StyledTable = styled.div`
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

export const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  animation: ${fadeInAndOut} ${({ theme }) => theme.slowAnimationDuration}
    linear forwards;
`
