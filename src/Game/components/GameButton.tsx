import { FC, useEffect, useState } from 'react'

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

  const [label, setLabel] = useState<ButtonProps['label']>('')

  const onPassOrEndTurn: ButtonProps['onClick'] = () => {
    dispatch(GameActions.endTurn())
  }

  const getOnClickCard = (): ButtonProps['onClick'] => {
    if (phase === GamePhase.PLAYER_TURN) {
      return onPassOrEndTurn
    }

    return undefined
  }

  useEffect(() => {
    if (activePlayer) {
      if (
        phase === GamePhase.PLAYER_TURN &&
        !activePlayer.hasPlayedCardThisTurn
      ) {
        return setLabel(passButtonMessage)
      }

      if (
        phase === GamePhase.PLAYER_TURN &&
        activePlayer.hasPlayedCardThisTurn
      ) {
        return setLabel(endTurnMessage)
      }
    }

    setLabel('')
  }, [activePlayer, phase])

  if (!activePlayer) return null

  return (
    label && (
      <div className={styles.gameButtonWrapper}>
        <Button label={label} onClick={getOnClickCard()} />
      </div>
    )
  )
}

export default GameButton
