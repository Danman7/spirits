import { createSelector } from '@reduxjs/toolkit'
import { MainState } from 'src/state/types'

export const getGameState = (state: MainState) => state.game

export const getGameTurn = createSelector(
  getGameState,
  gameState => gameState.turn
)

export const getActivePlayerId = createSelector(
  getGameState,
  gameState => gameState.activePlayerId
)

export const getTopPlayer = createSelector(
  getGameState,
  gameState => gameState.topPlayer
)

export const getBottomPlayer = createSelector(
  getGameState,
  gameState => gameState.bottomPlayer
)