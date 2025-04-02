import type {
  DuelAction,
  DuelState,
} from 'src/modules/duel/state/duelState.types'
import {
  calculateAttackQueue,
  drawCardFromDeck,
  drawInitialCardsForBothPlayers,
  handleIncome,
  moveSingleCard,
  redrawCard,
  setInitialPlayerOrder,
  setupPlayersFromUsers,
} from 'src/modules/duel/state/duelState.utils'
import {
  generateAttackLogMessage,
  generateDamagedSelfLogMessage,
  generateDiscardLogMessage,
  generateHasPlayedCardMessage,
  generatePlayerActionLogMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/playLogs'
import {
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
} from 'src/modules/duel/state/playLogs/playLogs.messages'

import type { Agent } from 'src/shared/modules/cards'

export const initialState: DuelState = {
  players: {},
  cards: {},
  playerOrder: ['', ''],
  attackingQueue: [],
  phase: 'Initial Draw',
  logs: [],
  validTargets: [],
}

export const duelReducer = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState => {
  const { playerOrder, players, logs, attackingQueue, cards } = state
  const [activePlayerId, inactivePlayerId] = playerOrder
  const activePlayer = state.players[activePlayerId]
  const inactivePlayer = state.players[inactivePlayerId]

  switch (action.type) {
    case 'START_DUEL': {
      const { users, firstPlayerIndex } = action

      return {
        ...state,
        ...setupPlayersFromUsers(users),
        playerOrder: setInitialPlayerOrder(users, firstPlayerIndex),
      }
    }

    case 'DRAW_INITIAL_CARDS': {
      return {
        ...state,
        phase: 'Redrawing',
        players: drawInitialCardsForBothPlayers(players),
      }
    }

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

    case 'ADVANCE_TURN': {
      return {
        ...state,
        phase: 'Player Turn',
        attackingQueue: initialState.attackingQueue,
        playerOrder: [inactivePlayerId, activePlayerId],
        players: {
          [inactivePlayerId]: {
            ...inactivePlayer,
            ...drawCardFromDeck(inactivePlayer),
            ...handleIncome(inactivePlayer),
            hasPerformedAction: false,
          },
          [activePlayerId]: { ...activePlayer, hasPerformedAction: false },
        },
        logs: [
          ...logs,
          generatePlayerActionLogMessage(
            inactivePlayer,
            playersTurnLogMessage,
            true,
          ),
        ],
      }
    }

    case 'RESOLVE_TURN': {
      const attackingQueue = calculateAttackQueue(state)

      return { ...state, phase: 'Resolving turn', attackingQueue }
    }

    case 'AGENT_ATTACK': {
      const { defendingPlayerId, defendingAgentId } = action
      const defendingPlayer = players[defendingPlayerId]
      const { coins } = defendingPlayer
      const defendingAgent = defendingAgentId
        ? (cards[defendingAgentId] as Agent)
        : undefined
      const { attackingPlayerId, attackerId } = attackingQueue[0]
      const attackingAgent = cards[attackerId] as Agent
      const attackerIsActive = attackingPlayerId === activePlayerId

      return {
        ...state,
        players: {
          ...players,
          [defendingPlayerId]: {
            ...defendingPlayer,
            coins: defendingAgent ? coins : coins - 1,
          },
        },
        cards:
          defendingAgentId && defendingAgent
            ? {
                ...cards,
                [defendingAgentId]: {
                  id: defendingAgentId,
                  ...defendingAgent,
                  strength: defendingAgent.strength - 1,
                },
              }
            : cards,
        logs: [
          ...logs,
          generateAttackLogMessage(
            attackingAgent,
            defendingPlayer,
            defendingAgent,
            attackerIsActive,
          ),
        ],
      }
    }

    case 'MOVE_TO_NEXT_ATTACKER': {
      return { ...state, attackingQueue: attackingQueue.slice(1) }
    }

    case 'PLAY_CARD': {
      const { cardId, playerId, shouldPay } = action
      const playingPlayer = players[playerId]
      const { coins } = playingPlayer
      const playedCard = cards[cardId]

      return {
        ...state,
        players: {
          ...players,
          [playerId]: {
            ...playingPlayer,
            ...moveSingleCard({
              player: playingPlayer,
              cardId,
              target: 'board',
            }),
            hasPerformedAction: true,
            coins: shouldPay ? coins - playedCard.cost : coins,
          },
        },
        logs: shouldPay
          ? [...logs, generateHasPlayedCardMessage(playingPlayer, playedCard)]
          : logs,
      }
    }

    case 'DISCARD_CARD': {
      const { players } = state
      const { cardId, playerId } = action
      const discardingPlayer = players[playerId]

      return {
        ...state,
        players: {
          ...players,
          [playerId]: {
            ...discardingPlayer,
            ...moveSingleCard({
              player: discardingPlayer,
              cardId,
              target: 'discard',
            }),
          },
        },
        logs: [...logs, generateDiscardLogMessage(cards[cardId].name)],
      }
    }

    case 'UPDATE_AGENT': {
      const { cardId, update } = action
      const updatedCard = cards[cardId] as Agent

      return {
        ...state,
        cards: {
          ...cards,
          [cardId]: { id: cardId, ...updatedCard, ...update },
        },
      }
    }

    case 'ADD_LOG':
      return { ...state, logs: [...logs, action.message] }

    case 'AGENT_DAMAGE_SELF': {
      const { amount, cardId } = action
      const updatedCard = cards[cardId] as Agent

      return {
        ...state,
        cards: {
          ...cards,
          [cardId]: {
            id: cardId,
            ...updatedCard,
            strength: updatedCard.strength - amount,
          },
        },
        logs: [
          ...logs,
          generateTriggerLogMessage(
            generateDamagedSelfLogMessage(updatedCard, amount),
          ),
        ],
      }
    }

    case 'TRIGGER_TARGET_SELECTION': {
      const { validTargets } = action
      return { ...state, phase: 'Select Target', validTargets }
    }

    default:
      return state
  }
}
