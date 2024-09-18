import { FC } from 'react'

import { endTurnMessage, passButtonMessage } from 'src/features/duel/messages'
import { DuelPhase } from 'src/features/duel/types'
import { getPhase, getPlayerPrespective } from 'src/features/duel/selectors'
import { endTurn } from 'src/features/duel/slice'

import { useAppDispatch, useAppSelector } from 'src/app/store'
import * as styles from 'src/shared/styles/styles.module.css'
import Button, { ButtonProps } from 'src/shared/components/Button'

const GameButton: FC = () => {
  const dispatch = useAppDispatch()

  const phase = useAppSelector(getPhase)
  const playerPrespective = useAppSelector(getPlayerPrespective)

  const onPassOrEndTurn: ButtonProps['onClick'] = () => {
    dispatch(endTurn())
  }

  const onClickButton: ButtonProps['onClick'] =
    phase === DuelPhase.PLAYER_TURN ? onPassOrEndTurn : undefined

  let buttonLabel = ''

  if (playerPrespective.isActive) {
    if (
      phase === DuelPhase.PLAYER_TURN &&
      !playerPrespective.hasPlayedCardThisTurn
    ) {
      buttonLabel = passButtonMessage
    }

    if (
      phase === DuelPhase.PLAYER_TURN &&
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
