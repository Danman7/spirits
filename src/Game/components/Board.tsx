import { FC, useCallback, useEffect, useRef, useState } from 'react'
import {
  BottomPlayerHand,
  StyledBoard,
  TopPlayerBoard,
  BottomPlayerBoard,
  PlayerHand,
  TopPlayerInfo,
  BottomPlayerInfo,
  EndTurnButton,
  CoinsElement,
  FaceDownStack,
  TopPlayerNonBoard,
  BottomPlayerNonBoard
} from './GameStyles'
import {
  getActivePlayerId,
  getTopPlayer,
  getBottomPlayer,
  getGameTurn,
  getIsCardPlayedThisTurn
} from '../GameSelectors'
import { GameActions } from '../GameSlice'
import { Overlay } from './Overlay'
import { useAppDispatch, useAppSelector } from '../../state'
import { endTurnMessage, passButtonMessage } from '../messages'
import { compPlayTurn } from '../ComputerPlayerUtils'
import { useTheme } from 'styled-components'
import { numberChangeAnimation } from '../../utils/animations'
import { usePrevious } from '../../utils/customHooks'
import { CardPortal } from '../../Cards/components/CardPortal'
import { CardProps, PlayCard } from '../../Cards/CardTypes'
import { CardState } from '../GameTypes'

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
  const isCardPlayedThisTurn = useAppSelector(getIsCardPlayedThisTurn)

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

  const onPlayCard: CardProps['onClickCard'] = useCallback(
    (card: PlayCard) => {
      dispatch(GameActions.playCard(card))
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

      <TopPlayerNonBoard>
        <FaceDownStack>
          {topPlayer.discard.map(card => (
            <CardPortal
              key={card.id}
              card={card}
              cardState={CardState.InDiscard}
            />
          ))}
        </FaceDownStack>

        <PlayerHand>
          {topPlayer.hand.map(card => (
            <CardPortal
              key={card.id}
              card={card}
              cardState={CardState.InHand}
            />
          ))}
        </PlayerHand>

        <FaceDownStack>
          {topPlayer.deck.map(card => (
            <CardPortal
              key={card.id}
              card={card}
              cardState={CardState.InDeck}
            />
          ))}
        </FaceDownStack>
      </TopPlayerNonBoard>

      <TopPlayerBoard>
        {topPlayer.board.map(card => (
          <CardPortal key={card.id} card={card} cardState={CardState.OnBoard} />
        ))}
      </TopPlayerBoard>

      <BottomPlayerBoard>
        {bottomPlayer.board.map(card => (
          <CardPortal
            key={card.id}
            card={card}
            isPlayerCard
            cardState={CardState.OnBoard}
          />
        ))}
      </BottomPlayerBoard>

      <BottomPlayerNonBoard>
        <FaceDownStack>
          {bottomPlayer.discard.map(card => (
            <CardPortal
              key={card.id}
              card={card}
              isPlayerCard
              cardState={CardState.InDiscard}
            />
          ))}
        </FaceDownStack>

        <BottomPlayerHand>
          {bottomPlayer.hand.map(card => (
            <CardPortal
              key={card.id}
              card={card}
              isPlayerCard
              cardState={CardState.InHand}
            />
          ))}
        </BottomPlayerHand>

        <FaceDownStack>
          {bottomPlayer.deck.map(card => (
            <CardPortal
              key={card.id}
              card={card}
              isPlayerCard
              cardState={CardState.InDeck}
            />
          ))}
        </FaceDownStack>
      </BottomPlayerNonBoard>

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
