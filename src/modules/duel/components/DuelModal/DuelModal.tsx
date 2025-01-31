import { FC, ReactNode, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import {
  getActivePlayerId,
  getPhase,
  getPlayers,
  getVictoriousPlayerId,
  initialDrawMessage,
  opponentFirst,
  playerFirst,
  playersDrawInitialCards,
  victoryMessage,
} from 'src/modules/duel'
import { getUserId } from 'src/modules/user'
import { Modal } from 'src/shared/components'
import { PHASE_MODAL_TIMEOUT } from 'src/shared/constants'

const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, PHASE_MODAL_TIMEOUT)
}

export const DuelModal: FC = () => {
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false)

  const dispatch = useAppDispatch()
  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const userId = useAppSelector(getUserId)
  const victoriousPlayerId = useAppSelector(getVictoriousPlayerId)

  const player = players[userId]
  const victoriousPlayerName = victoriousPlayerId
    ? players[victoriousPlayerId].name
    : ''
  const isActive = player.id === activePlayerId
  const playerNames = Object.values(players).map(({ name }) => name)

  const onDuelModalCloseEnd = () => dispatch(playersDrawInitialCards())

  const duelModalContent: ReactNode = useMemo(() => {
    switch (phase) {
      case 'Initial Draw':
        return (
          <>
            <h1>{`${playerNames[0]} vs ${playerNames[1]}`}</h1>
            <p>{initialDrawMessage}</p>
            <h3>{isActive ? playerFirst : opponentFirst}</h3>
          </>
        )

      case 'Duel End':
        return <h1>{`${victoriousPlayerName} ${victoryMessage}`}</h1>
    }
  }, [phase])

  // Modal visibility based on duel phase
  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        flashModal(setIsDuelModalOpen)
        break

      case 'Duel End':
        setIsDuelModalOpen(true)
        break
    }
  }, [phase])

  return (
    <Modal isOpen={isDuelModalOpen} onClosingComplete={onDuelModalCloseEnd}>
      {duelModalContent}
    </Modal>
  )
}
