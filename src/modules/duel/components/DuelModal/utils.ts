import { MODAL_TIMEOUT } from 'src/modules/duel/components/DuelModal/constants'

export const flashModal = (setModalVisibility: (isOpen: boolean) => void) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, MODAL_TIMEOUT)
}
