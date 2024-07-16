import { StyledCard } from 'src/Cards/components/styles'
import styled from 'styled-components'

export const StyledTable = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`

export const TableRow = styled.div`
  height: ${({ theme }) => theme.cardHeight}px;
  padding: ${({ theme }) => theme.spacing}px;
  display: flex;
  flex-direction: row;
`

const PlayerDeck = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  ${StyledCard} {
    margin-right: -${({ theme }) => theme.cardHeight / 2}px;
  }
`

export const TopPlayerDeck = styled(PlayerDeck)`
  margin-top: -200px;
`

export const BottomPlayerDeck = styled(PlayerDeck)`
  margin-bottom: -200px;

  ${StyledCard}:hover {
    margin-bottom: 200px;
  }
`
