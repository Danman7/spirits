import { Action, ListenerEffect, PayloadAction } from '@reduxjs/toolkit'
import { SHORT_ANIMATION_CYCLE } from 'src/Game/constants'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { AppDispatch, Player, RootState } from 'src/shared/redux/StateTypes'

// Handle initial draw
export const drawCardListener: ListenerEffect<
  PayloadAction<Player['id'], typeof GameActions.drawCardFromDeck.type>,
  RootState,
  AppDispatch
> = async (action, listenerApi) => {
  const { playerOrder } = listenerApi.getState().game

  await listenerApi.delay(SHORT_ANIMATION_CYCLE)

  if (action.type === GameActions.drawCardFromDeck.type) {
    listenerApi.dispatch(GameActions.drawCardFromDeck(action.payload))
  } else {
    playerOrder.forEach(playerId =>
      listenerApi.dispatch(GameActions.drawCardFromDeck(playerId))
    )
  }
}

// Handle starting redraw and skipping redraw as a CPU player
export const startRedrawListener: ListenerEffect<
  PayloadAction<Player['id'], typeof GameActions.drawCardFromDeck.type>,
  RootState,
  AppDispatch
> = (_, listenerApi) => {
  listenerApi.unsubscribe()

  listenerApi.dispatch(GameActions.startRedraw())

  const { players, playerOrder } = listenerApi.getState().game

  playerOrder.forEach(playerId => {
    const player = players[playerId]

    if (player.isCPU && !player.isReady) {
      listenerApi.dispatch(GameActions.completeRedraw(player.id))
    }
  })
}

// Handle starting game if both players are ready with redraw
export const completeRedrawListener: ListenerEffect<
  Action<typeof GameActions.completeRedraw.type>,
  RootState,
  AppDispatch
> = (_, listenerApi) => {
  listenerApi.unsubscribe()

  listenerApi.dispatch(GameActions.startGame())
}
