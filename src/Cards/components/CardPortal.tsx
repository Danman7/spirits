import { FC, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { CardPortalProps, CardProps, CardState } from '../CardTypes'
import { Card } from './Card'
import { getCardPortalElements } from '../CardUtils'
import { useAppDispatch, useAppSelector } from '../../state'
import {
  getActivePlayerId,
  getBottomPlayer,
  getIsCardPlayedThisTurn
} from '../../Game/GameSelectors'
import { GameActions } from '../../Game/GameSlice'
import { PlayCard } from '../CardTypes'

export const CardPortal: FC<CardPortalProps> = ({ card, isPlayerCard }) => {
  const { cost, state } = card

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
    (!isPlayerCard && state !== CardState.OnBoard) || state === CardState.InDeck

  const isPlayable =
    isPlayerCard &&
    state === CardState.InHand &&
    cost <= bottomPlayer.coins &&
    isPlayerTurn &&
    !isCardPlayedThisTurn

  const onClickCard =
    isPlayerTurn && !isCardPlayedThisTurn && state === CardState.InHand
      ? onPlayCard
      : undefined

  return createPortal(
    <Card
      card={card}
      isFaceDown={isFaceDown}
      isPlayable={isPlayable}
      onClickCard={onClickCard}
    />,
    getCardPortalElements(state, isPlayerCard)
  )
}
