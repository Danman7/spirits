import {
  useDuelModalContent,
  useDuelModalShow,
} from 'src/modules/duel/components/Board/DuelModal/hooks'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

import { Modal } from 'src/shared/components'

export const DuelModal: React.FC = () => {
  const { dispatch } = useDuel()

  const onDuelModalCloseEnd = () => dispatch({ type: 'DRAW_INITIAL_CARDS' })

  return (
    <Modal isOpen={useDuelModalShow()} onClosingComplete={onDuelModalCloseEnd}>
      {useDuelModalContent()}
    </Modal>
  )
}
