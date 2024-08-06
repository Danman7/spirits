import { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
  BottomPlayerHand,
  StyledBoard,
  TopPlayField,
  BottomPlayField,
  TopPlayerHand,
  TopPlayerInfo,
  BottomPlayerInfo,
  EndTurnButton
} from './styles'
import {
  getActivePlayerId,
  getTopPlayer,
  getBottomPlayer,
  getGameTurn,
  getIsCardPlayedThisTurn
} from '../GameSelectors'
import { Card } from 'src/Cards/components/Card'
import { GameActions } from '../GameSlice'
import { CardProps } from 'src/Cards/components/types'
import { Overlay } from './Overlay'
import { SLOW_ANIMATION_DURATION } from '../constants'
import { useAppDispatch, useAppSelector } from 'src/state'
import { useSelector } from 'react-redux'
import { endTurnMessage, passButtonMessage } from '../messages'
import { compPlayTurn } from '../ComputerPlayerUtils'

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
  const isCardPlayedThisTurn = useSelector(getIsCardPlayedThisTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId

  const prevIsPlayerTurn = useRef(isPlayerTurn).current

  const onPlayCard: CardProps['onClick'] = useCallback(
    (cardId: string) => {
      dispatch(GameActions.playCard(cardId))
    },
    [dispatch]
  )

  const onEndTurn = useCallback(() => {
    dispatch(GameActions.endTurn())
  }, [dispatch])

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

  useEffect(() => {
    if (
      prevIsPlayerTurn !== isPlayerTurn &&
      topPlayer.isNonHuman &&
      !isPlayerTurn
    ) {
      compPlayTurn(topPlayer, onPlayCard, onEndTurn)
    }
  }, [isPlayerTurn, prevIsPlayerTurn, topPlayer, onPlayCard, onEndTurn])

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
            onClick={
              isPlayerTurn && !isCardPlayedThisTurn ? onPlayCard : undefined
            }
          />
        ))}
      </BottomPlayerHand>

      <BottomPlayerInfo $isActivePlayer={isPlayerTurn}>
        <span>{bottomPlayer?.name}</span> / <span>{bottomPlayer?.coins}</span>
      </BottomPlayerInfo>

      {shouldShowOverlay && <Overlay />}

      {isPlayerTurn && (
        <EndTurnButton onClick={onEndTurn}>
          {isCardPlayedThisTurn ? endTurnMessage : passButtonMessage}
        </EndTurnButton>
      )}
    </StyledBoard>
  )
}
