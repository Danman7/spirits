import { useEffect, useState } from 'react'
import { useDuelModalContent } from 'src/modules/duel/components/DuelModal/duelModalHooks'
import { flashModal } from 'src/modules/duel/components/DuelModal/DuelModalUtils'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { Modal } from 'src/shared/components/Modal'

export const DuelModal: React.FC = () => {
  const {
    state: { phase },
    dispatch,
  } = useDuel()

  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false)

  const onDuelModalCloseEnd = () =>
    dispatch({
      type: 'DRAW_INITIAL_CARDS',
    })

  useEffect(() => {
    switch (phase) {
      case 'Initial Draw':
        flashModal(setIsDuelModalOpen)
        break
    }
  }, [phase])

  return (
    <Modal isOpen={isDuelModalOpen} onClosingComplete={onDuelModalCloseEnd}>
      {useDuelModalContent()}
    </Modal>
  )
}
