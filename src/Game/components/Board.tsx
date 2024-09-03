import { FC, ReactNode, useEffect, useState } from 'react'

import * as styles from 'src/shared/styles/styles.module.css'
import Modal from 'src/shared/components/Modal'
import {
  getActivePlayer,
  getPhase,
  getPlayers
} from 'src/shared/redux/selectors/GameSelectors'
import { useAppDispatch, useAppSelector } from 'src/shared/redux/hooks'
import PlayerHalfBoard from 'src/Game/components/PlayerHalfBoard'
import { GamePhase, PlayerIndex } from 'src/shared/redux/StateTypes'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import InitialPhaseModal from 'src/shared/components/ModalVariants/InitialPhaseModal'
import PlayerTurnModal from 'src/shared/components/ModalVariants/PlayerTurnModal'
import {
  INITIAL_CARD_DRAW_AMOUNT,
  LONG_ANIMATION_CYCLE
} from 'src/Game/constants'
import { compPlayTurn } from 'src/Game/ComputerPlayerUtils'
import { getTurn } from 'src/shared/redux/selectors/GameSelectors'

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const [overlayContent, setOverlayContent] = useState<ReactNode>(null)

  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const turn = useAppSelector(getTurn)
  const activePlayer = useAppSelector(getActivePlayer)

  const onAnimationComplete = () => {
    if (phase === GamePhase.INITIAL_DRAW) {
      players.forEach((_, playerIndex) =>
        dispatch(GameActions.drawCardFromDeck(playerIndex as PlayerIndex))
      )
    }
  }

  const onExitComplete = () => {
    if (activePlayer.isCPU && phase === GamePhase.PLAYER_TURN) {
      compPlayTurn(
        activePlayer,
        players.indexOf(activePlayer) as PlayerIndex,
        dispatch
      )
    }
  }

  useEffect(() => {
    if (
      phase === GamePhase.INITIAL_DRAW &&
      players.every(({ hand }) => hand.length === INITIAL_CARD_DRAW_AMOUNT)
    ) {
      dispatch(GameActions.startRedraw())
    }

    if (phase === GamePhase.REDRAW && players.every(({ isReady }) => isReady)) {
      dispatch(GameActions.startGame())
    }
  }, [phase, players, dispatch])

  useEffect(() => {
    switch (phase) {
      case GamePhase.INITIAL_DRAW:
        setOverlayContent(<InitialPhaseModal />)

        break

      case GamePhase.PLAYER_TURN:
        setOverlayContent(<PlayerTurnModal />)

        setTimeout(() => {
          setOverlayContent(null)
        }, LONG_ANIMATION_CYCLE)
        break
    }
  }, [phase, turn, dispatch])

  if (phase === GamePhase.PRE_GAME) return null

  return (
    <div className={styles.board}>
      {players.map((player, index) => (
        <PlayerHalfBoard
          key={player.id}
          player={player}
          phase={phase}
          playerIndex={index as PlayerIndex}
          setOverlayContent={setOverlayContent}
        />
      ))}

      <Modal
        onAnimationComplete={onAnimationComplete}
        onExitComplete={onExitComplete}
      >
        {overlayContent}
      </Modal>
    </div>
  )
}

export default Board
