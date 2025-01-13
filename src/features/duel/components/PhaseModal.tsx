import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import {
  initialDrawMessage,
  opponentFirst,
  playerFirst,
  victoryMessage,
} from 'src/features/duel/messages'
import { DuelPhase } from 'src/features/duel/types'

import { Modal } from 'src/shared/components/Modal'
import { PHASE_MODAL_TIMEOUT } from 'src/shared/constants'

const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, PHASE_MODAL_TIMEOUT)
}

export interface PhaseModalProps {
  isLoggedInPlayerActive: boolean
  playerNames: string[]
  phase: DuelPhase
  victoriousPlayerName?: string
  onPhaseModalCloseEnd: () => void
}

export const PhaseModal: FC<PhaseModalProps> = ({
  isLoggedInPlayerActive,
  playerNames,
  phase,
  victoriousPlayerName,
  onPhaseModalCloseEnd,
}) => {
  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false)

  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        flashModal(setIsPhaseModalOpen)

        break
    }
  }, [phase])

  const phaseModalContent: ReactNode = useMemo(() => {
    if (victoriousPlayerName) {
      return <h1>{`${victoriousPlayerName} ${victoryMessage}`}</h1>
    }

    switch (phase) {
      case 'Initial Draw':
        return (
          <>
            <h1>{`${playerNames[0]} vs ${playerNames[1]}`}</h1>
            <p>{initialDrawMessage}</p>
            <h3>{isLoggedInPlayerActive ? playerFirst : opponentFirst}</h3>
          </>
        )
    }
  }, [phase, isLoggedInPlayerActive, playerNames, victoriousPlayerName])

  return (
    <Modal isOpen={isPhaseModalOpen} onClosingComplete={onPhaseModalCloseEnd}>
      {phaseModalContent}
    </Modal>
  )
}
