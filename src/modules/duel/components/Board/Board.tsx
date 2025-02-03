import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import {
  endDuel,
  getAttackingAgentId,
  getPhase,
  getPlayers,
  moveToNextTurn,
  sortDuelPlayers,
  startFirstPlayerTurn,
} from 'src/modules/duel'
import {
  ActionPanel,
  DuelModal,
  PlayerField,
  StackBrowseModal,
  StyledBoard,
} from 'src/modules/duel/components'
import { getUserId } from 'src/modules/user'

export const Board: FC = () => {
  const dispatch = useAppDispatch()
  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const loggedInPlayerId = useAppSelector(getUserId)
  const attackingAgentId = useAppSelector(getAttackingAgentId)

  // Begin player turn if both players completed redraw
  useEffect(() => {
    if (
      phase === 'Redrawing' &&
      Object.values(players).every(
        ({ hasPerformedAction }) => !!hasPerformedAction,
      )
    ) {
      dispatch(startFirstPlayerTurn())
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

  return (
    <StyledBoard>
      {sortDuelPlayers(players, loggedInPlayerId).map(({ id }, index) => (
        <PlayerField key={id} playerId={id} isOnTop={!index} />
      ))}

      <DuelModal />

      <StackBrowseModal />

      <ActionPanel />
    </StyledBoard>
  )
}
