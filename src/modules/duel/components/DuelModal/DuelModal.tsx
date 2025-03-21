import {
  useDuelModalContent,
  useDuelModalShow,
} from 'src/modules/duel/components/DuelModal/duelModalHooks'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { Modal } from 'src/shared/components/Modal'

export const DuelModal: React.FC = () => {
  const { dispatch } = useDuel()

  const onDuelModalCloseEnd = () =>
    dispatch({
      type: 'DRAW_INITIAL_CARDS',
    })

  const isDuelModalOpen = useDuelModalShow()

  return (
    <Modal isOpen={isDuelModalOpen} onClosingComplete={onDuelModalCloseEnd}>
      {useDuelModalContent()}
    </Modal>
  )
}
