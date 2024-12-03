import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'src/app/store'

const getDuelState = (state: RootState) => state.duel

export const getTurn = createSelector(
  getDuelState,
  (duelState) => duelState.turn,
)

export const getPhase = createSelector(
  getDuelState,
  (duelState) => duelState.phase,
)

export const getPlayers = createSelector(
  getDuelState,
  (duelState) => duelState.players,
)

export const getPlayerOrder = createSelector(
  getDuelState,
  (duelState) => duelState.playerOrder,
)

export const getLoggedInPlayerId = createSelector(
  getDuelState,
  (duelState) => duelState.loggedInPlayerId,
)

export const getActivePlayerId = createSelector(
  getDuelState,
  (duelState) => duelState.activePlayerId,
)

export const getAttackingAgentId = createSelector(
  getDuelState,
  (duelState) => duelState.attackingAgentId,
)
