import { FC } from 'react'

import * as styles from 'src/shared/styles/styles.module.css'
import Button, { ButtonProps } from 'src/shared/components/Button'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import {
  getPhase,
  getPlayerPrespective
} from 'src/shared/redux/selectors/GameSelectors'
import { GamePhase } from 'src/shared/redux/StateTypes'
import { endTurnMessage, passButtonMessage } from 'src/Game/messages'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'

const GameButton: FC = () => {
  const dispatch = useAppDispatch()

  const phase = useAppSelector(getPhase)
  const playerPrespective = useAppSelector(getPlayerPrespective)

  const onPassOrEndTurn: ButtonProps['onClick'] = () => {
    dispatch(GameActions.endTurn())
  }

  const onClickButton: ButtonProps['onClick'] =
    phase === GamePhase.PLAYER_TURN ? onPassOrEndTurn : undefined

  let buttonLabel = ''

  if (playerPrespective.isActive) {
    if (
      phase === GamePhase.PLAYER_TURN &&
      !playerPrespective.hasPlayedCardThisTurn
    ) {
      buttonLabel = passButtonMessage
    }

    if (
      phase === GamePhase.PLAYER_TURN &&
      playerPrespective.hasPlayedCardThisTurn
    ) {
      buttonLabel = endTurnMessage
    }
  }

  if (!playerPrespective.isActive) return null

  return (
    buttonLabel && (
      <div className={styles.gameButtonWrapper}>
        <Button label={buttonLabel} onClick={onClickButton} />
      </div>
    )
  )
}

export default GameButton
