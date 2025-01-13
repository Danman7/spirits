import { FC, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from 'src/app/store'
import { ActionPanel } from 'src/features/duel/components/ActionPanel'
import { PhaseModal } from 'src/features/duel/components/PhaseModal'
import PlayerField from 'src/features/duel/components/PlayerField'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getPhase,
  getPlayers,
} from 'src/features/duel/selectors'
import {
  moveToNextTurn,
  playersDrawInitialCards,
} from 'src/features/duel/slice'
import { getInactivePlayerId, sortDuelPlayers } from 'src/features/duel/utils'
import { getUserId } from 'src/features/user/selector'

export const Board: FC = () => {
  const dispatch = useAppDispatch()
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const loggedInPlayerId = useAppSelector(getUserId)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const loggedInPlayer = players[loggedInPlayerId]
  const opponent = players[getInactivePlayerId(players, loggedInPlayerId)]
  const isLoggedInPlayerActive = loggedInPlayerId === activePlayerId
  const victoriousPlayerName =
    opponent.coins <= 0
      ? loggedInPlayer.name
      : loggedInPlayer.coins <= 0
        ? opponent.name
        : undefined

  const onPhaseModalCloseEnd = () => {
    if (phase === 'Initial Draw') {
      dispatch(playersDrawInitialCards())
      setIsSidePanelOpen(true)
    }
  }

  // Begin player turn if both players completed redraw
  useEffect(() => {
    if (
      phase === 'Redrawing' &&
      Object.values(players).every(
        ({ hasPerformedAction }) => !!hasPerformedAction,
      )
    ) {
      dispatch(moveToNextTurn())
    }
  }, [players, phase, dispatch])

  // If there is no attacker at turn resolving, move to the next round
  useEffect(() => {
    if (phase === 'Resolving turn' && !attackingAgentId) {
      dispatch(moveToNextTurn())
    }
  }, [attackingAgentId, phase, dispatch])

  return (
    <>
      {sortDuelPlayers(players, loggedInPlayerId).map((player, index) => (
        <PlayerField
          key={player.id}
          player={player}
          isOnTop={!index}
          isActive={player.id === activePlayerId}
          phase={phase}
          attackingAgentId={attackingAgentId}
        />
      ))}

      <PhaseModal
        playerNames={Object.values(players).map(({ name }) => name)}
        phase={phase}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
        victoriousPlayerName={victoriousPlayerName}
        onPhaseModalCloseEnd={onPhaseModalCloseEnd}
      />

      <ActionPanel
        isOpen={isSidePanelOpen}
        loggedInPlayer={loggedInPlayer}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
        phase={phase}
      />
    </>
  )
}
