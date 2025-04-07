import { FC, ReactNode, useEffect, useState } from 'react'

import {
  ModalWrapper,
  Overlay,
  StyledModal,
} from 'src/shared/components/Modal/Modal.styles'
import type { AnimateState } from 'src/shared/components/sharedComponents.types'
import { getIsTest } from 'src/shared/shared.utils'

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
      if (getIsTest()) return setShouldShowModal(false)

      setModalAnimation('out')
    }
  }, [isOpen])

  return shouldShowModal ? (
    <ModalWrapper>
      <Overlay
        $animateState={overlayAnimation}
        onAnimationEnd={onOverlayAnimationEnd}
      />

      <StyledModal
        $animateState={modalAnimation}
        onAnimationEnd={onModalAnimationEnd}
      >
        {children}
      </StyledModal>
    </ModalWrapper>
  ) : null
}
