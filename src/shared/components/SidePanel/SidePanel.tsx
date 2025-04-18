import { FC, ReactNode, useEffect, useState } from 'react'

import { AnimateState } from 'src/shared/components/sharedComponents.types'
import { Panel } from 'src/shared/components/SidePanel/SidePanel.styles'
import { Color } from 'src/shared/shared.types'

interface SidePanelProps {
  isOpen: boolean
  children: ReactNode
  color?: Color
}

export const SidePanel: FC<SidePanelProps> = ({ isOpen, children, color }) => {
  const [shouldShowPanel, setShouldShowPanel] = useState(isOpen)
  const [animation, setAnimation] = useState<AnimateState>('')

  const onAnimationEnd = () => {
    if (!isOpen) {
      setShouldShowPanel(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setShouldShowPanel(true)
      setAnimation('in')
    }

    if (!isOpen) {
      setAnimation('out')
    }
  }, [isOpen])

  return shouldShowPanel ? (
    <Panel
      $animateState={animation}
      onAnimationEnd={onAnimationEnd}
      $color={color}
    >
      {children}
    </Panel>
  ) : null
}
