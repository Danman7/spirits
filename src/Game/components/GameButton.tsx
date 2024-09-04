import { FC } from 'react'

import * as styles from 'src/shared/styles/styles.module.css'
import Button, { ButtonProps } from 'src/shared/components/Button'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import {
  getActivePlayer,
  getPhase
} from 'src/shared/redux/selectors/GameSelectors'
import { GamePhase } from 'src/shared/redux/StateTypes'
import { endTurnMessage, passButtonMessage } from 'src/Game/messages'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'

const GameButton: FC = () => {
  const dispatch = useAppDispatch()

  const activePlayer = useAppSelector(getActivePlayer)
  const phase = useAppSelector(getPhase)

  const onPassOrEndTurn: ButtonProps['onClick'] = () => {
    dispatch(GameActions.endTurn())
  }

  const onClickButton: ButtonProps['onClick'] =
    phase === GamePhase.PLAYER_TURN ? onPassOrEndTurn : undefined

  let buttonLabel = ''

  if (activePlayer) {
    if (
      phase === GamePhase.PLAYER_TURN &&
      !activePlayer.hasPlayedCardThisTurn
    ) {
      buttonLabel = passButtonMessage
    }

    if (phase === GamePhase.PLAYER_TURN && activePlayer.hasPlayedCardThisTurn) {
      buttonLabel = endTurnMessage
    }
  }

  if (!activePlayer) return null

  return (
    buttonLabel && (
      <div className={styles.gameButtonWrapper}>
        <Button label={buttonLabel} onClick={onClickButton} />
      </div>
    )
  )
}

export default GameButton
