import { FC, ReactNode, useEffect, useState } from 'react'

import 'src/features/duel/listeners/duelFlow'
import 'src/features/duel/listeners/computerPlayer'
import PlayerHalfBoard from 'src/features/duel/components/PlayerHalfBoard'
import { DuelPhase } from 'src/features/duel/types'
import {
  getPhase,
  getPlayerOrder,
  getPlayers,
  getTurn,
} from 'src/features/duel/selectors'
import { LONG_ANIMATION_CYCLE } from 'src/features/duel/constants'
import InitialPhaseModal from 'src/features/duel/components/modals/InitialPhaseModal'
import PlayerTurnModal from 'src/features/duel/components/modals/PlayerTurnModal'
import RedrawPhaseModal from 'src/features/duel/components/modals/RedrawPhaseModal'

import Modal from 'src/shared/components/Modal'

import * as styles from 'src/shared/styles/styles.module.css'
import { useAppSelector } from 'src/app/store'

const Board: FC = () => {
  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)
  const phase = useAppSelector(getPhase)
  const turn = useAppSelector(getTurn)

  const [modalContent, setModalContent] = useState<ReactNode>(null)

  useEffect(() => {
    switch (phase) {
      case DuelPhase.INITIAL_DRAW:
        setModalContent(<InitialPhaseModal />)
        break

      case DuelPhase.PLAYER_TURN:
        setModalContent(<PlayerTurnModal />)

        setTimeout(() => {
          setModalContent(null)
        }, LONG_ANIMATION_CYCLE)
        break

      case DuelPhase.REDRAW:
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
