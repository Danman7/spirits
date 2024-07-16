import { FC } from 'react'
import {
  BottomPlayerDeck,
  StyledTable,
  TableRow,
  TopPlayerDeck
} from './styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  getActivePlayerId,
  getTopPlayer,
  getBottomPlayer
} from '../GameSelectors'
import { Card } from 'src/Cards/components/Card'
import { GameActions } from '../GameSlice'
import { CardProps } from 'src/Cards/components/types'

export const Table: FC = () => {
  const dispatch = useDispatch()

  const topPlayer = useSelector(getTopPlayer)
  const bottomPlayer = useSelector(getBottomPlayer)
  const activePlayerId = useSelector(getActivePlayerId)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId

  const onPlayCard: CardProps['onClick'] = cardId =>
    dispatch(GameActions.playCard(cardId))

  return (
    <StyledTable>
      <TopPlayerDeck>
        {topPlayer?.deck.map(card => <Card card={card} isFaceDown />)}
      </TopPlayerDeck>
      <TableRow>{topPlayer?.field.map(card => <Card card={card} />)}</TableRow>
      <TableRow>
        {bottomPlayer?.field.map(card => <Card card={card} />)}
      </TableRow>
      <BottomPlayerDeck>
        {bottomPlayer?.deck.map(card => (
          <Card card={card} onClick={isPlayerTurn ? onPlayCard : undefined} />
        ))}
      </BottomPlayerDeck>
    </StyledTable>
  )
}
