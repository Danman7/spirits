import type {
  DuelAction,
  DuelState,
} from 'src/modules/duel/state/duelState.types'
import {
  calculateAttackQueue,
  drawCardFromDeck,
  handleIncome,
  moveSingleCard,
} from 'src/modules/duel/state/duelState.utils'
import {
  generateAttackLogMessage,
  generateDamagedSelfLogMessage,
  generateDiscardLogMessage,
  generateHasPlayedCardMessage,
  generatePlayerActionLogMessage,
  generateTriggerLogMessage,
} from 'src/modules/duel/state/playLogs'
import { playersTurnLogMessage } from 'src/modules/duel/state/playLogs/playLogs.messages'
import { initialState } from 'src/modules/duel/state/reducer/duel.reducer'

import type { Agent } from 'src/shared/modules/cards'

export const duelReducerTurns = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState | undefined => {
  const { playerOrder, players, logs, attackingQueue, cards, targeting } = state
  const [activePlayerId, inactivePlayerId] = playerOrder
  const activePlayer = state.players[activePlayerId]
  const inactivePlayer = state.players[inactivePlayerId]

  switch (action.type) {
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
      const { cardId, playerId } = action
      const discardingPlayer = players[playerId]
      const { cost } = cards[cardId]

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
            income: discardingPlayer.income + cost,
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
      const { validTargets, showTargetingModal } = action
      return {
        ...state,
        phase: 'Select Target',
        targeting: {
          validTargets,
          showTargetingModal:
            showTargetingModal || targeting.showTargetingModal,
        },
      }
    }

    case 'SELECT_TARGET': {
      return { ...state, targeting: initialState.targeting }
    }

    default:
      return undefined
  }
}
