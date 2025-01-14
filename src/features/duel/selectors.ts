import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/app/store'
import { getUserId } from 'src/features/user/selectors'

const getDuelState = (state: RootState) => state.duel

export const getPhase = createSelector(
  getDuelState,
  (duelState) => duelState.phase,
)

export const getPlayers = createSelector(
  getDuelState,
  (duelState) => duelState.players,
)

export const getActivePlayerId = createSelector(
  getDuelState,
  (duelState) => duelState.activePlayerId,
)

export const getAttackingAgentId = createSelector(
  getDuelState,
  (duelState) => duelState.attackingAgentId,
)

export const getVictoriousPlayerId = createSelector(
  getDuelState,
  (duelState) => duelState.victoriousPlayerId,
)

export const getBrowsedStack = createSelector(
  getDuelState,
  (duelState) => duelState.browsedStack,
)

export const getUserPlayer = createSelector(
  getPlayers,
  getUserId,
  (players, userId) => players[userId],
)
