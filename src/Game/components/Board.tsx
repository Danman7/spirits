import { FC, useCallback, useEffect, useState } from 'react'

import * as styles from 'src/shared/styles/styles.module.css'

import Overlay from 'src/Game/components/Overlay'

import {
  getActivePlayer,
  getHasActivePlayerPlayedACardThisTurn,
  getIsActivePlayerNonHuman,
  getIsPlayerPrespectiveTurn,
  getPhase,
  getPlayers
} from 'src/shared/redux/selectors/GameSelectors'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import {
  endTurnMessage,
  passButtonMessage,
  redrawMessage
} from 'src/Game/messages'
import { compPlayTurn } from 'src/Game/ComputerPlayerUtils'
import { CardProps, PlayCard } from 'src/Cards/CardTypes'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import PlayerHalfBoard from 'src/Game/components/PlayerHalfBoard'
import { GamePhase } from 'src/shared/redux/StateTypes'

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const [overlayMessage, setOverlayMessage] = useState('')

  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const activePlayer = useAppSelector(getActivePlayer)
  const isActivePlayerNonHuman = useAppSelector(getIsActivePlayerNonHuman)
  const isPlayerPrespectiveTurn = useAppSelector(getIsPlayerPrespectiveTurn)
  const hasActivePlayerPlayedACardThisTurn = useAppSelector(
    getHasActivePlayerPlayedACardThisTurn
  )

  const onPlayCard: CardProps['onClickCard'] = useCallback(
    (card: PlayCard) => {
      dispatch(GameActions.playCardFromHand(card))
    },
    [dispatch]
  )

  const onPassOrEndTurn = useCallback(() => {
    dispatch(GameActions.endTurn())
  }, [dispatch])

  const onAnimationComplete = () => {
    if (isActivePlayerNonHuman && activePlayer) {
      compPlayTurn(activePlayer, onPlayCard, onPassOrEndTurn)
    }
  }

  const orderedPlayers = [...players].sort(
    (a, b) => Number(a.isPlayerPrespective) - Number(b.isPlayerPrespective)
  )

  const hasPlayerPlayedCardThisTurn = hasActivePlayerPlayedACardThisTurn

  const onClickCard =
    isPlayerPrespectiveTurn && !hasPlayerPlayedCardThisTurn
      ? onPlayCard
      : undefined

  useEffect(() => {
    if (phase === GamePhase.REDRAW) setOverlayMessage(redrawMessage)
  }, [phase])

  return (
    <div className={styles.board}>
      {orderedPlayers.map((player, index) => (
        <PlayerHalfBoard
          player={player}
          isOnTop={!index}
          onClickCard={index ? onClickCard : undefined}
        />
      ))}

      <Overlay
        message={overlayMessage}
        onAnimationComplete={onAnimationComplete}
      />

      {isPlayerPrespectiveTurn && (
        <button className={styles.endTurnButton} onClick={onPassOrEndTurn}>
          {hasPlayerPlayedCardThisTurn ? endTurnMessage : passButtonMessage}
        </button>
      )}
    </div>
  )
}

export default Board
