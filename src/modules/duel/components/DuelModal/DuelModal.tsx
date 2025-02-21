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
      playerOrder: [activePlayerId, inactivePlayerId],
    },
    dispatch,
  } = useDuel()

  const { name: firstPlayerName } = players[activePlayerId]
  const { name: secontPlayerName } = players[inactivePlayerId]

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
            <h1>{`${firstPlayerName} vs ${secontPlayerName}`}</h1>
            <p>{initialDrawMessage}</p>
            <h3>{`${firstPlayerName} ${firstPlayerMessage}`}</h3>
          </>
        )
    }
  }, [firstPlayerName, secontPlayerName, phase])

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
