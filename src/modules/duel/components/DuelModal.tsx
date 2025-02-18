import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  firstPlayerMessage,
  initialDrawMessage,
  useDuel,
} from 'src/modules/duel'
import { Modal } from 'src/shared/components'
import { PHASE_MODAL_TIMEOUT } from 'src/shared/constants'

const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, PHASE_MODAL_TIMEOUT)
}

export const DuelModal: React.FC = () => {
  const {
    state: {
      players,
      phase,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  const playerNames = Object.values(players).map(({ name }) => name)
  const { name: firstPlayerName } = players[activePlayerId]

  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false)

  const onDuelModalCloseEnd = () =>
    dispatch({
      type: 'DRAW_INITIAL_CARDS',
    })

  const duelModalContent: ReactNode = useMemo(() => {
    switch (phase) {
      case 'Initial Draw':
        return (
          <>
            <h1>{`${playerNames[0]} vs ${playerNames[1]}`}</h1>
            <p>{initialDrawMessage}</p>
            <h3>{`${firstPlayerName} ${firstPlayerMessage}`}</h3>
          </>
        )
    }
  }, [phase])

  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        flashModal(setIsDuelModalOpen)
        break
    }
  }, [phase])

  return (
    <Modal isOpen={isDuelModalOpen} onClosingComplete={onDuelModalCloseEnd}>
      {duelModalContent}
    </Modal>
  )
}
