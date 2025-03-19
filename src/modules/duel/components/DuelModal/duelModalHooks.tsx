import { ReactNode, useMemo } from 'react'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { VersusModalContent } from 'src/modules/duel/components/DuelModal/components/VersusModalContent'

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
