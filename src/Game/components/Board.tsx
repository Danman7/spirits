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
import { redrawMessage } from 'src/Game/messages'
import { compPlayTurn } from 'src/Game/ComputerPlayerUtils'
import { CardProps, PlayCard } from 'src/Cards/CardTypes'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import PlayerHalfBoard from 'src/Game/components/PlayerHalfBoard'
import { GamePhase } from 'src/shared/redux/StateTypes'
import Button from 'src/shared/components/Button'
import { getPlayerButtonText } from 'src/Game/GameUtils'

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

  const onClickCard =
    isPlayerPrespectiveTurn && !hasActivePlayerPlayedACardThisTurn
      ? onPlayCard
      : undefined

  useEffect(() => {
    switch (phase) {
      case GamePhase.REDRAW:
        setOverlayMessage(redrawMessage)
        break

      default:
        setOverlayMessage('')
        break
    }
  }, [phase])

  if (phase === GamePhase.PRE_GAME) return null

  return (
    <div className={styles.board}>
      {orderedPlayers.map((player, index) => (
        <PlayerHalfBoard
          key={player.id}
          player={player}
          isOnTop={!index}
          onClickCard={index ? onClickCard : undefined}
        />
      ))}

      <Overlay
        message={overlayMessage}
        onAnimationComplete={onAnimationComplete}
      />

      <div className={styles.endTurnButton}>
        <Button
          label={getPlayerButtonText({
            phase,
            hasActivePlayerPlayedACardThisTurn,
            isPlayerPrespectiveTurn
          })}
          onClick={onPassOrEndTurn}
        />
      </div>
    </div>
  )
}

export default Board
