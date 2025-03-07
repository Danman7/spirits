import { FC, ReactNode, useEffect, useState } from 'react'
import { Panel } from 'src/shared/components/SidePanel/SidePanelStyles'
import { AnimateState } from 'src/shared/components/types'
import { Color } from 'src/shared/SharedTypes'
import { PANEL_TEST_ID } from 'src/shared/test/testIds'

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
      data-testid={PANEL_TEST_ID}
      $animateState={animation}
      onAnimationEnd={onAnimationEnd}
      $color={color}
    >
      {children}
    </Panel>
  ) : null
}
