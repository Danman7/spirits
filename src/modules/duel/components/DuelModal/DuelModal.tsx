import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  firstPlayerMessage,
  initialDrawMessage,
} from 'src/modules/duel/components/DuelModal/DuelModalMessages'
import { flashModal } from 'src/modules/duel/components/DuelModal/DuelModalUtils'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { Modal } from 'src/shared/components/Modal'

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
