import { FC, ReactNode, useEffect, useState } from 'react'

import animations from 'src/shared/styles/animations.module.css'
import styles from 'src/shared/styles/styles.module.css'
import { MODAL_TEST_ID } from 'src/shared/testIds'

interface ModalProps {
  isOpen: boolean
  children: ReactNode
  onClosingComplete?: () => void
}

const Modal: FC<ModalProps> = ({
  isOpen = false,
  children = '',
  onClosingComplete,
}) => {
  const [shouldShowModal, setShouldShowModal] = useState(isOpen)
  const [overlayAnimation, setOverlayAnimation] = useState('')
  const [modalAnimation, setModalAnimation] = useState('')

  const onOverlayAnimationEnd = () => {
    if (isOpen && process.env.NODE_ENV !== 'test') {
      setModalAnimation(` ${animations.slideInOpacity}`)
    } else {
      if (onClosingComplete) {
        onClosingComplete()
      }

      setShouldShowModal(false)
    }
  }

  const onModalAnimationEnd = () => {
    if (!isOpen) {
      setOverlayAnimation(` ${animations.fadeOut}`)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShouldShowModal(true)
      setModalAnimation(` ${animations.paused}`)
      setOverlayAnimation(` ${animations.fadeIn}`)
    }

    if (!isOpen) {
      setModalAnimation(` ${animations.slideOutOpacity}`)
    }
  }, [isOpen])

  return shouldShowModal ? (
    <div className={styles.modalWrapper}>
      <div
        className={`${styles.overlay}${overlayAnimation}`}
        onAnimationEnd={onOverlayAnimationEnd}
        data-testid={MODAL_TEST_ID}
      />

      <div
        className={`${styles.modal}${modalAnimation}`}
        onAnimationEnd={onModalAnimationEnd}
      >
        {children}
      </div>
    </div>
  ) : null
}

export default Modal
