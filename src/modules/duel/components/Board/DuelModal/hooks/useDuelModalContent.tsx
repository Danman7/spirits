import { useMemo } from 'react'

import { VersusModalContent } from 'src/modules/duel/components/Board/DuelModal/VersusModalContent'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

export const useDuelModalContent = () => {
  const {
    state: { phase },
  } = useDuel()

  return useMemo(() => {
    switch (phase) {
      case 'Pre-duel':
        return <VersusModalContent />
    }
  }, [phase])
}
