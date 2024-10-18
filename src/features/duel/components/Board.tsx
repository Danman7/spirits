import { FC, ReactNode, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import InitialPhaseModal from 'src/features/duel/components/modals/InitialPhaseModal'
import PlayerTurnModal from 'src/features/duel/components/modals/PlayerTurnModal'
import RedrawPhaseModal from 'src/features/duel/components/modals/RedrawPhaseModal'
import VictoryModal from 'src/features/duel/components/modals/VictoryModal'
import PlayerHalfBoard from 'src/features/duel/components/PlayerHalfBoard'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'
import 'src/features/duel/listeners/computerPlayer'
import 'src/features/duel/listeners/duelFlow'
import {
  getPhase,
  getPlayerOrder,
  getPlayers,
  getTurn,
  getVictoriousPlayerName,
} from 'src/features/duel/selectors'
import { beginPlay, startRedraw } from 'src/features/duel/slice'
import Modal from 'src/shared/components/Modal'
import * as styles from 'src/shared/styles/styles.module.css'

const Board: FC = () => {
  const dispatch = useAppDispatch()

  const players = useAppSelector(getPlayers)
  const playerOrder = useAppSelector(getPlayerOrder)
  const phase = useAppSelector(getPhase)
  const turn = useAppSelector(getTurn)
  const victorName = useAppSelector(getVictoriousPlayerName)

  const victoryModalContent: ReactNode = victorName ? (
    <VictoryModal victorName={victorName} />
  ) : null

  const [gameModalContent, setGameModalContent] = useState<ReactNode>(null)

  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        setGameModalContent(<InitialPhaseModal />)
        break

      case 'Player Turn':
        setGameModalContent(<PlayerTurnModal />)
        break

      case 'Redrawing Phase':
        setGameModalContent(<RedrawPhaseModal playerId={playerOrder[1]} />)
        break
    }
  }, [phase, turn, playerOrder])

  useEffect(() => {
    if (
      phase === 'Initial Draw' &&
      Object.values(players).every(
        ({ hand }) => hand.length === INITIAL_CARD_DRAW_AMOUNT,
      )
    ) {
      dispatch(startRedraw())
    }
  }, [dispatch, phase, players])

  useEffect(() => {
    if (
      phase === 'Redrawing Phase' &&
      Object.values(players).every(
        ({ hasPerformedAction }) => !!hasPerformedAction,
      )
    ) {
      dispatch(beginPlay())
    }
  }, [dispatch, phase, players])

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

      <Modal
        style={{ left: '1em', transform: 'translate(0, -50%)', zIndex: 3 }}
      >
        {gameModalContent}
      </Modal>

      <Modal hasOverlay style={{ zIndex: 5 }}>
        {victoryModalContent}
      </Modal>
    </div>
  )
}

export default Board
