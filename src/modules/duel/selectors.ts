import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'src/app'

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
  (duelState) => duelState.playerOrder[0],
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

export const getIsBrowsingStack = createSelector(
  getDuelState,
  (duelState) => duelState.isBrowsingStack,
)

export const getattackingQueue = createSelector(
  getDuelState,
  (duelState) => duelState.attackingQueue,
)
