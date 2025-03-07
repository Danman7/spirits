import { MODAL_TIMEOUT } from 'src/modules/duel/components/DuelModal/DuelModalConstants'

export const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, MODAL_TIMEOUT)
}
