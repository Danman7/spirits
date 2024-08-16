import { FC, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { CardPortalProps, CardProps, CardState } from './types'
import { Card } from './Card'
import { getCardPortalElements } from '../utils'
import { useAppDispatch, useAppSelector } from '../../state'
import {
  getActivePlayerId,
  getBottomPlayer,
  getIsCardPlayedThisTurn
} from '../../Game/GameSelectors'
import { GameActions } from '../../Game/GameSlice'
import { usePrevious } from '../../utils/customHooks'

export const CardPortal: FC<CardPortalProps> = ({ card, isPlayerCard }) => {
  const { cost, state, onPlayAbility } = card

  const dispatch = useAppDispatch()

  const bottomPlayer = useAppSelector(getBottomPlayer)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const isCardPlayedThisTurn = useAppSelector(getIsCardPlayedThisTurn)

  const onPlayCard: CardProps['onClickCard'] = useCallback(
    (cardId: string) => {
      dispatch(GameActions.playCard(cardId))
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

  const prevState = usePrevious(state)

  useEffect(() => {
    if (
      prevState === CardState.InHand &&
      state === CardState.OnBoard &&
      onPlayAbility
    ) {
      dispatch(GameActions.triggerOnPlayAbility(onPlayAbility))
    }
  }, [prevState, state, dispatch, onPlayAbility])

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
