import { FC, ReactNode, useEffect, useState } from 'react'

import * as styles from 'src/shared/styles/styles.module.css'
import Modal from 'src/shared/components/Modal'
import {
  getPhase,
  getPlayerOrder,
  getPlayers,
  getTurn
} from 'src/shared/redux/selectors/GameSelectors'
import { useAppSelector } from 'src/shared/redux/hooks'
import PlayerHalfBoard from 'src/Game/components/PlayerHalfBoard'
import { GamePhase } from 'src/shared/redux/StateTypes'
import InitialPhaseModal from 'src/shared/components/ModalVariants/InitialPhaseModal'
import PlayerTurnModal from 'src/shared/components/ModalVariants/PlayerTurnModal'
import RedrawPhaseModal from 'src/shared/components/ModalVariants/RedrawPhaseModal'
import { LONG_ANIMATION_CYCLE } from 'src/Game/constants'

const Board: FC = () => {
  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)
  const phase = useAppSelector(getPhase)
  const turn = useAppSelector(getTurn)

  const [modalContent, setModalContent] = useState<ReactNode>(null)

  useEffect(() => {
    switch (phase) {
      case GamePhase.INITIAL_DRAW:
        setModalContent(<InitialPhaseModal />)
        break

      case GamePhase.PLAYER_TURN:
        setModalContent(<PlayerTurnModal />)

        setTimeout(() => {
          setModalContent(null)
        }, LONG_ANIMATION_CYCLE)
        break

      case GamePhase.REDRAW:
        setModalContent(<RedrawPhaseModal playerId={playerOrder[1]} />)
        break
    }
  }, [phase, turn, playerOrder])

  return (
    <div className={styles.board}>
      {playerOrder.map((playerId, index) => (
        <PlayerHalfBoard
          key={playerId}
          player={players[playerId]}
          phase={phase}
          isOnTop={!index}
        />
      ))}

      <Modal>{modalContent}</Modal>
    </div>
  )
}

export default Board
