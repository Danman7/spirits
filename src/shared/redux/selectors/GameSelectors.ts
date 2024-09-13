import { createSelector } from '@reduxjs/toolkit'

import { MainState } from 'src/shared/redux/StateTypes'

export const getGameState = (state: MainState) => state.game

export const getTurn = createSelector(getGameState, gameState => gameState.turn)

export const getPhase = createSelector(
  getGameState,
  gameState => gameState.phase
)

export const getLoggedInPlayerId = createSelector(
  getGameState,
  gameState => gameState.loggedInPlayerId
)

export const getPlayers = createSelector(
  getGameState,
  gameState => gameState.players
)

export const getPlayerOrder = createSelector(
  getGameState,
  gameState => gameState.playerOrder
)

export const getPlayerPrespective = createSelector(
  getPlayers,
  getPlayerOrder,
  (players, playerOrder) => players[playerOrder[1]]
)
