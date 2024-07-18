import { StyledCard } from 'src/Cards/components/styles'
import styled from 'styled-components'

export const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`
const PlayField = styled.div`
  height: 50vh;
  display: flex;
  flex-direction: row;
  justify-content: center;

  ${StyledCard} {
    transform: scale(0.7);
  }
`

export const TopPlayField = styled(PlayField)`
  border-bottom: 1px dashed ${({ theme }) => theme.colors.pale};
  align-items: flex-end;
`

export const BottomPlayField = styled(PlayField)`
  align-items: flex-start;
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
  bottom: -200px;
`
