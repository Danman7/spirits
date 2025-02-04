import { FC, ReactNode, useEffect, useState } from 'react'
import { Panel } from 'src/shared/components'
import { PANEL_TEST_ID } from 'src/shared/testIds'
import { AnimateState } from 'src/shared/types'

interface SidePanelProps {
  isOpen: boolean
  children: ReactNode
}

export const SidePanel: FC<SidePanelProps> = ({ isOpen, children }) => {
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
      data-testid={PANEL_TEST_ID}
      $animateState={animation}
      onAnimationEnd={onAnimationEnd}
    >
      {children}
    </Panel>
  ) : null
}
