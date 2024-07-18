import { FC, useEffect, useState } from 'react'
import {
  BottomPlayerDeck,
  StyledTable,
  TopPlayField,
  BottomPlayField,
  TopPlayerDeck
} from './styles'
import { useDispatch, useSelector } from 'react-redux'
import {
  getActivePlayerId,
  getTopPlayer,
  getBottomPlayer,
  getGameTurn
} from '../GameSelectors'
import { Card } from 'src/Cards/components/Card'
import { GameActions } from '../GameSlice'
import { CardProps } from 'src/Cards/components/types'
import { Overlay } from './Overlay'
import { SLOW_ANIMATION_DURATION } from '../constants'

export const Table: FC = () => {
  const dispatch = useDispatch()

  const [shouldShowOverlay, setShouldShowOverlay] = useState(false)

  const topPlayer = useSelector(getTopPlayer)
  const bottomPlayer = useSelector(getBottomPlayer)
  const activePlayerId = useSelector(getActivePlayerId)
  const turn = useSelector(getGameTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId

  const onPlayCard: CardProps['onClick'] = cardId =>
    dispatch(GameActions.playCard(cardId))

  useEffect(() => {
    setShouldShowOverlay(true)

    const overlayCloseTimer = setTimeout(() => {
      setShouldShowOverlay(false)
    }, SLOW_ANIMATION_DURATION)

    return () => {
      clearTimeout(overlayCloseTimer)
    }
  }, [turn])

  return (
    <StyledTable>
      <TopPlayerDeck>
        {topPlayer?.deck.map(card => <Card card={card} isFaceDown />)}
      </TopPlayerDeck>
      <TopPlayField>
        {topPlayer?.field.map(card => <Card card={card} />)}
      </TopPlayField>
      <BottomPlayField>
        {bottomPlayer?.field.map(card => <Card card={card} />)}
      </BottomPlayField>
      <BottomPlayerDeck>
        {bottomPlayer?.deck.map(card => (
          <Card card={card} onClick={isPlayerTurn ? onPlayCard : undefined} />
        ))}
      </BottomPlayerDeck>
      {shouldShowOverlay && <Overlay />}
    </StyledTable>
  )
}
