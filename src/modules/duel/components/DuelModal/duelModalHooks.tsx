import { ReactNode, useEffect, useMemo, useState } from 'react'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { VersusModalContent } from 'src/modules/duel/components/DuelModal/components/VersusModalContent'
import { useTheme } from 'styled-components'

export const useDuelModalContent = (): ReactNode => {
  const {
    state: { phase },
  } = useDuel()

  return useMemo(() => {
    switch (phase) {
      case 'Initial Draw':
        return <VersusModalContent />
    }
  }, [phase])
}

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
      case 'Initial Draw':
        flashModal()
        break
    }
  }, [phase, transitionTime])

  return isDuelModalOpen
}
