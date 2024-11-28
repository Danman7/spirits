import { FC, ReactNode, useEffect, useState } from 'react'

import styles from 'src/shared/styles/styles.module.css'
import animations from 'src/shared/styles/animations.module.css'

interface SidePanelProps {
  isOpen: boolean
  children: ReactNode
}

const SidePanel: FC<SidePanelProps> = ({ isOpen, children }) => {
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
      className={`${styles.sidePanel}${animation}`}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null
}

export default SidePanel
