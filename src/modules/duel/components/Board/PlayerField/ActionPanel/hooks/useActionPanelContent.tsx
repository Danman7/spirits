import { ReactNode } from 'react'

import {
  PlayerTurnPanelContent,
  RedrawingPanelContent,
} from 'src/modules/duel/components/Board/PlayerField/ActionPanel/content'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'

import { LoadingDots } from 'src/shared/components'
import { useUser } from 'src/shared/modules/user'

export const useActionPanelContent = (): ReactNode => {
  const {
    state: {
      players,
      phase,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  const {
    state: { id: playerId },
  } = useUser()

  if (!playerId) return null

  const { hasPerformedAction } = players[playerId]
  const isUserActive = playerId === activePlayerId

  const onPassTurn = () => dispatch({ type: 'RESOLVE_TURN' })

  const onReady = () => dispatch({ type: 'SKIP_REDRAW', playerId })

  switch (phase) {
    case 'Redrawing':
      return (
        <RedrawingPanelContent
          hasPerformedAction={hasPerformedAction}
          onReady={onReady}
        />
      )

    case 'Player Turn':
      return (
        <PlayerTurnPanelContent
          isUserActive={isUserActive}
          onPassTurn={onPassTurn}
        />
      )

    default:
      return <LoadingDots />
  }
}
