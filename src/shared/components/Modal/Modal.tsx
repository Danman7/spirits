import { FC, ReactNode, useEffect, useState } from 'react'
import {
  ModalWrapper,
  Overlay,
  StyledModal,
} from 'src/shared/components/Modal/styles'
import { AnimateState } from 'src/shared/components/types'
import { MODAL_TEST_ID, OVERLAY_TEST_ID } from 'src/shared/test/testIds'

interface ModalProps {
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
  const [overlayAnimation, setOverlayAnimation] = useState<AnimateState>('')
  const [modalAnimation, setModalAnimation] = useState<AnimateState>('')

  const onOverlayAnimationEnd = () => {
    if (isOpen) {
      setModalAnimation('in')
    } else {
      if (onClosingComplete) {
        onClosingComplete()
      }

      setShouldShowModal(false)
    }
  }

  const onModalAnimationEnd = () => {
    if (!isOpen) {
      setOverlayAnimation('out')
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShouldShowModal(true)
      setModalAnimation('')
      setOverlayAnimation('in')
    }

    if (!isOpen) {
      setModalAnimation('out')
    }
  }, [isOpen])

  return shouldShowModal ? (
    <ModalWrapper>
      <Overlay
        $animateState={overlayAnimation}
        data-testid={OVERLAY_TEST_ID}
        onAnimationEnd={onOverlayAnimationEnd}
      />

      <StyledModal
        $animateState={modalAnimation}
        data-testid={MODAL_TEST_ID}
        onAnimationEnd={onModalAnimationEnd}
      >
        {children}
      </StyledModal>
    </ModalWrapper>
  ) : null
}
