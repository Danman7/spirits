import { FC, ReactNode, useEffect, useState } from 'react'

import * as styles from 'src/shared/styles/styles.module.css'
import Modal from 'src/shared/components/Modal'
import {
  getActivePlayerIndex,
  getPhase,
  getPlayers
} from 'src/shared/redux/selectors/GameSelectors'
import { useAppSelector } from 'src/shared/redux/hooks'
import PlayerHalfBoard from 'src/Game/components/PlayerHalfBoard'
import { GamePhase, PlayerIndex } from 'src/shared/redux/StateTypes'
import InitialPhaseModal from 'src/shared/components/ModalVariants/InitialPhaseModal'
import PlayerTurnModal from 'src/shared/components/ModalVariants/PlayerTurnModal'
import RedrawPhaseModal from 'src/shared/components/ModalVariants/RedrawPhaseModal'
import { LONG_ANIMATION_CYCLE } from 'src/Game/constants'

const Board: FC = () => {
  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const activePlayerIndex = useAppSelector(getActivePlayerIndex)

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
        setModalContent(<RedrawPhaseModal playerIndex={activePlayerIndex} />)
        break
    }
  }, [activePlayerIndex, phase])

  return (
    <div className={styles.board}>
      {players.map((player, index) => (
        <PlayerHalfBoard
          key={player.id}
          player={player}
          phase={phase}
          playerIndex={index as PlayerIndex}
        />
      ))}

      <Modal>{modalContent}</Modal>
    </div>
  )
}

export default Board
