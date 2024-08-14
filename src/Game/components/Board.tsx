import { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
  BottomPlayerHand,
  StyledBoard,
  TopPlayerBoard,
  BottomPlayerBoard,
  TopPlayerHand,
  TopPlayerInfo,
  BottomPlayerInfo,
  EndTurnButton,
  CoinsElement
} from './styles'
import {
  getActivePlayerId,
  getTopPlayer,
  getBottomPlayer,
  getGameTurn,
  getIsCardPlayedThisTurn
} from '../GameSelectors'
import { Card } from '../../Cards/components/Card'
import { GameActions } from '../GameSlice'
import { CardProps, CardState } from '../../Cards/components/types'
import { Overlay } from './Overlay'
import { useAppDispatch, useAppSelector } from '../../state'
import { useSelector } from 'react-redux'
import { endTurnMessage, passButtonMessage } from '../messages'
import { compPlayTurn } from '../ComputerPlayerUtils'
import { useTheme } from 'styled-components'
import { numberChangeAnimation } from '../../utils/animations'
import { usePrevious } from '../../utils/customHooks'
import {
  BOTTOM_BOARD_ELEMENT_ID,
  BOTTOM_HAND_ELEMENT_ID,
  TOP_BOARD_ELEMENT_ID,
  TOP_HAND_ELEMENT_ID
} from '../constants'

export interface BoardProps {
  shouldDisableOverlay?: boolean
}

export const Board: FC<BoardProps> = ({ shouldDisableOverlay = false }) => {
  const dispatch = useAppDispatch()

  const theme = useTheme()

  const [shouldShowOverlay, setShouldShowOverlay] = useState(false)

  const topPlayer = useAppSelector(getTopPlayer)
  const bottomPlayer = useAppSelector(getBottomPlayer)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const turn = useAppSelector(getGameTurn)
  const isCardPlayedThisTurn = useSelector(getIsCardPlayedThisTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId

  const prevTopPlayerCoins = usePrevious(topPlayer.coins)
  const prevBottomPlayerCoins = usePrevious(bottomPlayer.coins)
  const prevActivePlayerId = usePrevious(activePlayerId)

  const topPlayerCoinsElement = useRef<HTMLDivElement>(null)
  const bottomPlayerCoinsElement = useRef<HTMLDivElement>(null)

  const topPlayerCoinChangeAnimation = numberChangeAnimation(
    topPlayerCoinsElement.current,
    theme
  )

  const bottomPlayerCoinChangeAnimation = numberChangeAnimation(
    bottomPlayerCoinsElement.current,
    theme
  )

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
    }, theme.slowAnimationDuration)

    return () => {
      clearTimeout(overlayCloseTimer)
    }
  }, [turn, shouldDisableOverlay, theme.slowAnimationDuration])

  useEffect(() => {
    if (
      topPlayer.isNonHuman &&
      prevActivePlayerId !== activePlayerId &&
      activePlayerId === topPlayer.id
    ) {
      compPlayTurn(topPlayer, onPlayCard, onEndTurn)
    }
  }, [activePlayerId, onEndTurn, onPlayCard, prevActivePlayerId, topPlayer])

  useEffect(() => {
    if (
      prevTopPlayerCoins &&
      prevTopPlayerCoins !== topPlayer.coins &&
      topPlayerCoinChangeAnimation.play
    ) {
      topPlayerCoinChangeAnimation.play()
    }
  }, [prevTopPlayerCoins, topPlayerCoinChangeAnimation, topPlayer.coins])

  useEffect(() => {
    if (
      prevBottomPlayerCoins &&
      prevBottomPlayerCoins !== bottomPlayer.coins &&
      bottomPlayerCoinChangeAnimation.play
    ) {
      bottomPlayerCoinChangeAnimation.play()
    }
  }, [
    prevBottomPlayerCoins,
    bottomPlayer.coins,
    bottomPlayerCoinChangeAnimation
  ])

  return (
    <StyledBoard>
      <TopPlayerInfo $isActivePlayer={!isPlayerTurn}>
        <span>{topPlayer?.name}</span> /{' '}
        <CoinsElement ref={topPlayerCoinsElement}>
          {topPlayer?.coins}
        </CoinsElement>
      </TopPlayerInfo>

      <TopPlayerHand id={TOP_HAND_ELEMENT_ID}>
        {topPlayer.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            isFaceDown={card.state !== CardState.OnBoard}
          />
        ))}
      </TopPlayerHand>

      <TopPlayerBoard id={TOP_BOARD_ELEMENT_ID} />

      <BottomPlayerBoard id={BOTTOM_BOARD_ELEMENT_ID} />

      <BottomPlayerHand id={BOTTOM_HAND_ELEMENT_ID}>
        {bottomPlayer.cards.map(card => (
          <Card
            key={card.id}
            card={card}
            isPlayerCard
            isPlayable={
              card.state === CardState.InHand &&
              card.cost <= bottomPlayer.coins &&
              isPlayerTurn &&
              !isCardPlayedThisTurn
            }
            onClick={
              isPlayerTurn && !isCardPlayedThisTurn ? onPlayCard : undefined
            }
          />
        ))}
      </BottomPlayerHand>

      <BottomPlayerInfo $isActivePlayer={isPlayerTurn}>
        <span>{bottomPlayer?.name}</span> /{' '}
        <CoinsElement ref={bottomPlayerCoinsElement}>
          {bottomPlayer?.coins}
        </CoinsElement>
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
