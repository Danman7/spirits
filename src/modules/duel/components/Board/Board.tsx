import { FC, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  ActionPanel,
  DuelModal,
  PlayerField,
  StyledBoard,
} from 'src/modules/duel/components'
import {
  getAttackingAgentId,
  getPhase,
  getPlayers,
} from 'src/modules/duel/selectors'
import { endDuel, moveToNextTurn } from 'src/modules/duel/slice'
import { sortDuelPlayers } from 'src/modules/duel/utils'
import { getUserId } from 'src/modules/user/selectors'

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

  return (
    <StyledBoard>
      {sortDuelPlayers(players, loggedInPlayerId).map(({ id }, index) => (
        <PlayerField key={id} playerId={id} isOnTop={!index} />
      ))}

      <DuelModal />

      <ActionPanel />
    </StyledBoard>
  )
}
