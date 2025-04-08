import type {
  DuelAction,
  DuelState,
} from 'src/modules/duel/state/duelState.types'
import {
  drawCardFromDeck,
  redrawCard,
} from 'src/modules/duel/state/duelState.utils'
import { generatePlayerActionLogMessage } from 'src/modules/duel/state/playLogs'
import {
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
} from 'src/modules/duel/state/playLogs/playLogs.messages'

export const initialState: DuelState = {
  players: {},
  cards: {},
  playerOrder: ['', ''],
  attackingQueue: [],
  phase: 'Pre-duel',
  logs: [],
  validTargets: [],
}

export const duelReducerRedraw = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState | undefined => {
  const { playerOrder, players, logs } = state
  const [activePlayerId, inactivePlayerId] = playerOrder
  const activePlayer = state.players[activePlayerId]
  const inactivePlayer = state.players[inactivePlayerId]

  switch (action.type) {
    case 'SKIP_REDRAW': {
      const { playerId } = action
      const player = players[playerId]

      return {
        ...state,
        players: {
          ...players,
          [playerId]: { ...player, hasPerformedAction: true },
        },
        logs: [
          ...logs,
          generatePlayerActionLogMessage(
            player,
            playerHasSkippedRedrawLogMessage,
          ),
        ],
      }
    }

    case 'REDRAW_CARD': {
      const { playerId, cardId } = action
      const redrawingPlayer = players[playerId]

      return {
        ...state,
        players: {
          ...players,
          [playerId]: {
            ...redrawingPlayer,
            ...redrawCard(redrawingPlayer, cardId),
            hasPerformedAction: true,
          },
        },
        logs: [
          ...logs,
          generatePlayerActionLogMessage(
            redrawingPlayer,
            playerHasDrawnCardLogMessage,
          ),
        ],
      }
    }

    case 'COMPLETE_REDRAW': {
      return {
        ...state,
        phase: 'Player Turn',
        players: {
          [inactivePlayerId]: { ...inactivePlayer, hasPerformedAction: false },
          [activePlayerId]: {
            ...activePlayer,
            ...drawCardFromDeck(activePlayer),
            hasPerformedAction: false,
          },
        },
        logs: [
          ...logs,
          generatePlayerActionLogMessage(
            activePlayer,
            playersTurnLogMessage,
            true,
          ),
        ],
      }
    }

    default:
      return undefined
  }
}
