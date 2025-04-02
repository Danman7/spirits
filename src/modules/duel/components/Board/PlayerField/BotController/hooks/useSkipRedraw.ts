import { useEffect } from 'react'

import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

export const useSkipRedraw = (playerId: string) => {
  const {
    state: { players, phase },
    dispatch,
  } = useDuel()

  const player = players[playerId]
  const { hasPerformedAction } = player

  useEffect(() => {
    if (phase !== 'Redrawing' || hasPerformedAction) return

    dispatch({ type: 'SKIP_REDRAW', playerId })
  }, [playerId, phase, hasPerformedAction, dispatch])
}
