import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'src/app/store'

export const getDuelState = (state: RootState) => state.duel

export const getTurn = createSelector(
  getDuelState,
  (duelState) => duelState.turn,
)

export const getPhase = createSelector(
  getDuelState,
  (duelState) => duelState.phase,
)

export const getLoggedInPlayerId = createSelector(
  getDuelState,
  (duelState) => duelState.loggedInPlayerId,
)

export const getPlayers = createSelector(
  getDuelState,
  (duelState) => duelState.players,
)

export const getPlayerOrder = createSelector(
  getDuelState,
  (duelState) => duelState.playerOrder,
)

export const getPlayerPrespective = createSelector(
  getPlayers,
  getPlayerOrder,
  (players, playerOrder) => players[playerOrder[1]],
)

export const getPlayerhasPerformedAction = createSelector(
  getPlayerPrespective,
  (player) => player.hasPerformedAction,
)

export const getActivePlayerId = createSelector(
  getDuelState,
  (duelState) => duelState.activePlayerId,
)

export const getActivePlayerName = createSelector(
  getPlayers,
  getActivePlayerId,
  (players, activePlayerId) => players[activePlayerId].name,
)

export const getAttackingAgentId = createSelector(
  getDuelState,
  (duelState) => duelState.attackingAgentId,
)

export const getPlayerNames = createSelector(getPlayers, (players) =>
  Object.values(players).map(({ name }) => name),
)

export const getVictoriousPlayerName = createSelector(
  getPlayers,
  getPlayerOrder,
  (players, playerOrder) =>
    players[playerOrder[0]].coins <= 0
      ? players[playerOrder[1]].name
      : players[playerOrder[1]].coins <= 0
        ? players[playerOrder[0]].name
        : null,
)
