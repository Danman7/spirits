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

export const getActivePlayer = createSelector(
  getPlayers,
  ([Player1, Player2]) =>
    Player1.isActive ? Player1 : Player2.isActive ? Player2 : null
)

export const getActivePlayerIndex = createSelector(getPlayers, ([Player1]) =>
  Player1.isActive ? 0 : 1
)
