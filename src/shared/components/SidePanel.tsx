import { FC, ReactNode, useEffect, useState } from 'react'

import animations from 'src/shared/styles/animations.module.css'
import styles from 'src/shared/styles/components.module.css'
import { PANEL_TEST_ID } from 'src/shared/testIds'

export interface SidePanelProps {
  isOpen: boolean
  children: ReactNode
}

export const SidePanel: FC<SidePanelProps> = ({ isOpen, children }) => {
  const [shouldShowPanel, setShouldShowPanel] = useState(isOpen)
  const [animation, setAnimation] = useState('')

  const onAnimationEnd = () => {
    if (!isOpen) {
      setShouldShowPanel(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShouldShowPanel(true)
      setAnimation(` ${animations.slideInLeft}`)
    }

    if (!isOpen) {
      setAnimation(` ${animations.slideOutLeft}`)
    }
  }, [isOpen])

  return shouldShowPanel ? (
    <div
      data-testid={PANEL_TEST_ID}
      className={`${styles.sidePanel}${animation}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null
}
