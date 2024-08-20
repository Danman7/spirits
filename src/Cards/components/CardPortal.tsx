import { FC, useCallback } from 'react'
import { CardPortalProps, CardProps } from '../CardTypes'
import { Card } from './Card'
import { useAppDispatch, useAppSelector } from '../../state'
import {
  getActivePlayerId,
  getBottomPlayer,
  getIsCardPlayedThisTurn
} from '../../Game/GameSelectors'
import { GameActions } from '../../Game/GameSlice'
import { PlayCard } from '../CardTypes'
import { CardState } from '../../Game/GameTypes'

export const CardPortal: FC<CardPortalProps> = ({
  card,
  isPlayerCard,
  cardState
}) => {
  const { cost } = card

  const dispatch = useAppDispatch()

  const bottomPlayer = useAppSelector(getBottomPlayer)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const isCardPlayedThisTurn = useAppSelector(getIsCardPlayedThisTurn)

  const onPlayCard: CardProps['onClickCard'] = useCallback(
    (card: PlayCard) => {
      dispatch(GameActions.playCard(card))
    },
    [dispatch]
  )

  const isPlayerTurn = bottomPlayer?.id === activePlayerId
  const isFaceDown =
    (!isPlayerCard && cardState !== CardState.OnBoard) ||
    cardState === CardState.InDeck

  const isPlayable =
    isPlayerCard &&
    cardState === CardState.InHand &&
    cost <= bottomPlayer.coins &&
    isPlayerTurn &&
    !isCardPlayedThisTurn

  const onClickCard =
    isPlayerTurn && !isCardPlayedThisTurn && cardState === CardState.InHand
      ? onPlayCard
      : undefined

  return (
    <Card
      card={card}
      isFaceDown={isFaceDown}
      isPlayable={isPlayable}
      isOnBoard={cardState === CardState.OnBoard}
      onClickCard={onClickCard}
    />
  )
}
