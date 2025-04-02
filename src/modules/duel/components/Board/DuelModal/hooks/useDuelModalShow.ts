import { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'

import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

export const useDuelModalShow = () => {
  const {
    state: { phase },
  } = useDuel()
  const { transitionTime } = useTheme()
  const [isDuelModalOpen, setIsDuelModalOpen] = useState(false)

  useEffect(() => {
    const flashModal = () => {
      setIsDuelModalOpen(true)

      setTimeout(() => {
        setIsDuelModalOpen(false)
      }, transitionTime)
    }

    switch (phase) {
      case 'Initial Draw':
        flashModal()
        break
    }
  }, [phase, transitionTime])

  return isDuelModalOpen
}
