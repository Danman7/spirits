import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import {
  opponentFirst,
  opponentTurnTitle,
  playerFirst,
  victoryMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import { DuelPhase, DuelPlayers } from 'src/features/duel/types'
import Modal from 'src/shared/components/Modal'
import { PHASE_MODAL_TIMEOUT } from 'src/shared/constants'

const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, PHASE_MODAL_TIMEOUT)
}

export interface PhaseModalProps {
  isLoggedInPlayerActive: boolean
  haveBothPlayersNotPerformedAction: boolean
  players: DuelPlayers
  phase: DuelPhase
  victoriousPlayerName?: string
  onPhaseModalCloseEnd: () => void
}

export const PhaseModal: FC<PhaseModalProps> = ({
  isLoggedInPlayerActive,
  haveBothPlayersNotPerformedAction,
  players,
  phase,
  victoriousPlayerName,
  onPhaseModalCloseEnd,
}) => {
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false)

  const playerNames = Object.values(players).map(({ name }) => name)

  useEffect(() => {
    switch (phase) {
      case 'Pre-duel':
        flashModal(setIsPhaseModalOpen)

        break
      case 'Player Turn':
        if (haveBothPlayersNotPerformedAction) {
          flashModal(setIsPhaseModalOpen)
        }

        break
    }
  }, [haveBothPlayersNotPerformedAction, phase])

  const phaseModalContent: ReactNode = useMemo(() => {
    if (victoriousPlayerName) {
      return <h1>{`${victoriousPlayerName} ${victoryMessage}`}</h1>
    }

    switch (phase) {
      case 'Pre-duel':
        return (
          <>
            <h1>{`${playerNames[0]} vs ${playerNames[1]}`}</h1>
            <div>{isLoggedInPlayerActive ? playerFirst : opponentFirst}</div>
          </>
        )

      case 'Player Turn':
        return (
          <h1>{isLoggedInPlayerActive ? yourTurnTitle : opponentTurnTitle}</h1>
        )
    }
  }, [phase, isLoggedInPlayerActive, playerNames, victoriousPlayerName])

  return (
    <Modal isOpen={isPhaseModalOpen} onClosingComplete={onPhaseModalCloseEnd}>
      {phaseModalContent}
    </Modal>
  )
}
