import { FC, ReactNode, useEffect, useState } from 'react'

import animations from 'src/shared/styles/animations.module.css'
import styles from 'src/shared/styles/components.module.css'
import { MODAL_TEST_ID, OVERLAY_TEST_ID } from 'src/shared/testIds'

export interface ModalProps {
  isOpen: boolean
  children: ReactNode
  onClosingComplete?: () => void
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  children,
  onClosingComplete,
}) => {
  const [shouldShowModal, setShouldShowModal] = useState(isOpen)
  const [overlayAnimation, setOverlayAnimation] = useState('')
  const [modalAnimation, setModalAnimation] = useState('')

  const onOverlayAnimationEnd = () => {
    if (isOpen) {
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
        data-testid={OVERLAY_TEST_ID}
      />

      <div
        className={`${styles.modal} ${modalAnimation}`}
        onAnimationEnd={onModalAnimationEnd}
        data-testid={MODAL_TEST_ID}
      >
        {children}
      </div>
    </div>
  ) : null
}
