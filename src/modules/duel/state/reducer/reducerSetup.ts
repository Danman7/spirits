import type {
  DuelAction,
  DuelState,
} from 'src/modules/duel/state/duelState.types'
import {
  drawInitialCardsForBothPlayers,
  setInitialPlayerOrder,
  setupPlayersFromUsers,
} from 'src/modules/duel/state/duelState.utils'

export const initialState: DuelState = {
  players: {},
  cards: {},
  playerOrder: ['', ''],
  attackingQueue: [],
  phase: 'Pre-duel',
  logs: [],
  validTargets: [],
}

export const duelReducerSetup = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState | undefined => {
  const { players, logs } = state

  switch (action.type) {
    case 'START_DUEL': {
      const { users, firstPlayerIndex } = action

      return {
        ...state,
        ...setupPlayersFromUsers(users),
        playerOrder: setInitialPlayerOrder(users, firstPlayerIndex),
      }
    }

    case 'PROCEED_TO_DRAW': {
      return { ...state, phase: 'Initial Draw' }
    }

    case 'DRAW_INITIAL_CARDS': {
      return {
        ...state,
        phase: 'Redrawing',
        players: drawInitialCardsForBothPlayers(players),
      }
    }

    case 'ADD_LOG':
      return { ...state, logs: [...logs, action.message] }

    default:
      return undefined
  }
}
