import { FC, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from 'src/app/store'
import { ActionPanel } from 'src/features/duel/components/ActionPanel'
import { DuelModal } from 'src/features/duel/components/DuelModal'
import PlayerField from 'src/features/duel/components/PlayerField'
import {
  getActivePlayerId,
  getAttackingAgentId,
  getPhase,
  getPlayers,
  getVictoriousPlayerId,
} from 'src/features/duel/selectors'
import {
  endDuel,
  moveToNextTurn,
  playersDrawInitialCards,
} from 'src/features/duel/slice'
import { sortDuelPlayers } from 'src/features/duel/utils'

import { getUserId } from 'src/features/user/selectors'

export const Board: FC = () => {
  const dispatch = useAppDispatch()
  const [isActionPanelOpen, setIsActionPanelOpen] = useState(false)
  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const loggedInPlayerId = useAppSelector(getUserId)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)
  const victoriousPlayerId = useAppSelector(getVictoriousPlayerId)
  const loggedInPlayer = players[loggedInPlayerId]
  const isLoggedInPlayerActive = loggedInPlayerId === activePlayerId

  const onDuelModalCloseEnd = () => {
    if (phase === 'Initial Draw') {
      dispatch(playersDrawInitialCards())
      setIsActionPanelOpen(true)
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

  // Show end duel modal
  useEffect(() => {
    if (Object.values(players).some(({ coins }) => coins <= 0)) {
      Object.values(players).forEach(({ id, coins }) => {
        if (coins > 0) dispatch(endDuel(id))
      })
    }
  }, [players, dispatch])

  // Hide action panel if the user has performed an action
  // to prevent multiple passes
  useEffect(() => {
    if (players[activePlayerId].hasPerformedAction) {
      setIsActionPanelOpen(false)
    }
  }, [activePlayerId, players])

  // Show action panel on advacing turns
  useEffect(() => {
    if (
      phase === 'Player Turn' &&
      !players[activePlayerId].hasPerformedAction
    ) {
      setIsActionPanelOpen(true)
    }
  }, [phase, activePlayerId, players])

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

      <DuelModal
        playerNames={Object.values(players).map(({ name }) => name)}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
        victoriousPlayerName={
          victoriousPlayerId && players[victoriousPlayerId].name
        }
        onDuelModalCloseEnd={onDuelModalCloseEnd}
      />

      <ActionPanel
        isOpen={isActionPanelOpen}
        loggedInPlayer={loggedInPlayer}
        isLoggedInPlayerActive={isLoggedInPlayerActive}
        phase={phase}
      />
    </>
  )
}
