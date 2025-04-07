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
      }, transitionTime * 20)
    }

    switch (phase) {
      case 'Pre-duel':
        flashModal()

        break
    }
  }, [phase, transitionTime])

  return isDuelModalOpen
}
