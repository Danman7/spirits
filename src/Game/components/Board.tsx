import { FC, useEffect, useState } from 'react'
import {
  BottomPlayerHand,
  StyledBoard,
  TopPlayField,
  BottomPlayField,
  TopPlayerHand,
  TopPlayerInfo,
  BottomPlayerInfo
} from './styles'
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
import { useAppDispatch, useAppSelector } from 'src/state'

export interface BoardProps {
  shouldDisableOverlay?: boolean
}

export const Board: FC<BoardProps> = ({ shouldDisableOverlay = false }) => {
  const dispatch = useAppDispatch()

  const [shouldShowOverlay, setShouldShowOverlay] = useState(false)

  const topPlayer = useAppSelector(getTopPlayer)
  const bottomPlayer = useAppSelector(getBottomPlayer)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const turn = useAppSelector(getGameTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId

  const onPlayCard: CardProps['onClick'] = cardId =>
    dispatch(GameActions.playCard(cardId))

  useEffect(() => {
    if (shouldDisableOverlay) {
      return
    }

    setShouldShowOverlay(true)

    const overlayCloseTimer = setTimeout(() => {
      setShouldShowOverlay(false)
    }, SLOW_ANIMATION_DURATION)

    return () => {
      clearTimeout(overlayCloseTimer)
    }
  }, [turn, shouldDisableOverlay])

  return (
    <StyledBoard>
      <TopPlayerInfo $isActivePlayer={!isPlayerTurn}>
        <span>{topPlayer?.name}</span> / <span>{topPlayer?.coins}</span>
      </TopPlayerInfo>

      <TopPlayerHand>
        {topPlayer?.hand.map(card => (
          <Card key={card.id} card={card} isFaceDown />
        ))}
      </TopPlayerHand>

      <TopPlayField>
        {topPlayer?.field.map(card => <Card key={card.id} card={card} />)}
      </TopPlayField>

      <BottomPlayField>
        {bottomPlayer?.field.map(card => <Card key={card.id} card={card} />)}
      </BottomPlayField>

      <BottomPlayerHand>
        {bottomPlayer?.hand.map(card => (
          <Card
            key={card.id}
            card={card}
            onClick={isPlayerTurn ? onPlayCard : undefined}
          />
        ))}
      </BottomPlayerHand>

      <BottomPlayerInfo $isActivePlayer={isPlayerTurn}>
        <span>{bottomPlayer?.name}</span> / <span>{bottomPlayer?.coins}</span>
      </BottomPlayerInfo>

      {shouldShowOverlay && <Overlay />}
    </StyledBoard>
  )
}
