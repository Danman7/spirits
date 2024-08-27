import { createSelector } from '@reduxjs/toolkit'

import { MainState } from 'src/shared/redux/StateTypes'

export const getGameState = (state: MainState) => state.game

export const getTurn = createSelector(getGameState, gameState => gameState.turn)

export const getPhase = createSelector(
  getGameState,
  gameState => gameState.phase
)

export const getPlayers = createSelector(
  getGameState,
  gameState => gameState.players
)

export const getActivePlayer = createSelector(getPlayers, players =>
  players.find(({ isActive }) => isActive)
)

export const getIsActivePlayerNonHuman = createSelector(
  getActivePlayer,
  activePlayer => activePlayer?.isCPU
)

export const getIsPlayerPrespectiveTurn = createSelector(
  getActivePlayer,
  activePlayer => activePlayer?.isPlayerPrespective
)

export const getHasActivePlayerPlayedACardThisTurn = createSelector(
  getActivePlayer,
  activePlayer => activePlayer?.hasPlayedCardThisTurn
)
