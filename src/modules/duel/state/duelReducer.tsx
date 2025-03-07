import { INCOME_PER_TURN } from 'src/modules/duel/constants'
import {
  agentAttackLogMessage,
  agentRetaliatesLogMessage,
  hasPlayedCardLogMessage,
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/messages'
import { DuelAction, DuelState } from 'src/modules/duel/types'
import {
  calculateAttackQueue,
  drawCardFromDeck,
  drawInitialCards,
  moveSingleCard,
  redrawCard,
  setInitialPlayerOrder,
  setPlayersFromUsers,
} from 'src/modules/duel/utils'
import { Agent } from 'src/shared/modules/cards/types'

export const initialState: DuelState = {
  players: {},
  playerOrder: ['', ''],
  attackingQueue: [],
  phase: 'Initial Draw',
  logs: [],
}

export const duelReducer = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState => {
  const { playerOrder, players, logs, attackingQueue } = state
  const [activePlayerId, inactivePlayerId] = playerOrder
  const activePlayer = state.players[activePlayerId]
  const inactivePlayer = state.players[inactivePlayerId]

  switch (action.type) {
    case 'START_DUEL': {
      const { users, firstPlayerIndex } = action

      return {
        ...state,
        players: setPlayersFromUsers(users),
        playerOrder: setInitialPlayerOrder(users, firstPlayerIndex),
      }
    }

    case 'DRAW_INITIAL_CARDS': {
      return {
        ...state,
        phase: 'Redrawing',
        players: {
          [inactivePlayerId]: {
            ...inactivePlayer,
            ...drawInitialCards(inactivePlayer),
          },
          [activePlayerId]: {
            ...activePlayer,
            ...drawInitialCards(activePlayer),
          },
        },
      }
    }

    case 'SKIP_REDRAW': {
      const { playerId } = action

      return {
        ...state,
        players: {
          ...players,
          [playerId]: { ...players[playerId], hasPerformedAction: true },
        },
        logs: [
          ...logs,
          <p>
            <strong>{players[playerId].name}</strong>
            {playerHasSkippedRedrawLogMessage}
          </p>,
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
          <p>
            <strong>{players[playerId].name}</strong>
            {playerHasDrawnCardLogMessage}
          </p>,
        ],
      }
    }

    case 'COMPLETE_REDRAW': {
      return {
        ...state,
        phase: 'Player Turn',
        players: {
          [inactivePlayerId]: {
            ...inactivePlayer,
            hasPerformedAction: false,
          },
          [activePlayerId]: {
            ...activePlayer,
            ...drawCardFromDeck(activePlayer),
            hasPerformedAction: false,
          },
        },
        logs: [
          ...logs,
          <h3>
            {activePlayer.name}
            {playersTurnLogMessage}
          </h3>,
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
            hasPerformedAction: false,
            coins: inactivePlayer.income
              ? inactivePlayer.coins + INCOME_PER_TURN
              : inactivePlayer.coins,
            income: inactivePlayer.income
              ? inactivePlayer.income - INCOME_PER_TURN
              : inactivePlayer.income,
          },
          [activePlayerId]: {
            ...activePlayer,
            hasPerformedAction: false,
          },
        },
        logs: [
          ...logs,
          <h3>
            {inactivePlayer.name}
            {playersTurnLogMessage}
          </h3>,
        ],
      }
    }

    case 'RESOLVE_TURN': {
      const attackingQueue = calculateAttackQueue(players, playerOrder)

      return {
        ...state,
        phase: 'Resolving turn',
        attackingQueue,
      }
    }

    case 'AGENT_ATTACK': {
      const { defendingPlayerId, defendingAgentId } = action
      const defendingPlayer = players[defendingPlayerId]
      const { coins, cards } = defendingPlayer
      const defendingAgent =
        defendingAgentId && (cards[defendingAgentId] as Agent)
      const { attackingPlayerId, attackerId } = attackingQueue[0]
      const { name: attackerName, traits } = players[attackingPlayerId].cards[
        attackerId
      ] as Agent

      return {
        ...state,
        players: {
          ...players,
          [defendingPlayerId]: {
            ...defendingPlayer,
            coins: defendingAgent ? coins : coins - 1,
            cards: defendingAgent
              ? {
                  ...cards,
                  [defendingAgentId]: {
                    id: defendingAgentId,
                    ...defendingAgent,
                    strength: defendingAgent.strength - 1,
                  },
                }
              : cards,
          },
        },
        logs: [
          ...logs,
          <p>
            <strong>{attackerName}</strong>
            {traits?.retaliates && defendingAgent
              ? agentRetaliatesLogMessage
              : agentAttackLogMessage}
            {defendingAgent ? (
              <>
                <strong>{defendingAgent.name}</strong>
                {reduceStrengthLogMessage}
                {defendingAgent.strength - 1}.
              </>
            ) : (
              <>
                <strong>{defendingPlayer.name}</strong>
                {reducingCoinsLogMessage}
                {coins - 1}.
              </>
            )}
          </p>,
        ],
      }
    }

    case 'MOVE_TO_NEXT_ATTACKER': {
      return {
        ...state,
        attackingQueue: attackingQueue.slice(1),
      }
    }

    case 'PLAY_CARD': {
      const { cardId, playerId, shouldPay } = action
      const playingPlayer = players[playerId]
      const { coins, name } = playingPlayer
      const { cost, name: playedCardName } = playingPlayer.cards[cardId]

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
            coins: shouldPay ? coins - cost : coins,
          },
        },
        logs: [
          ...logs,
          <p>
            <strong>{name}</strong>
            {hasPlayedCardLogMessage}
            <strong>{playedCardName}</strong>.
          </p>,
        ],
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
      }
    }

    case 'UPDATE_AGENT': {
      const { cardId, playerId, update } = action
      const player = players[playerId]
      const { cards } = player
      const updatedCard = cards[cardId] as Agent

      return {
        ...state,
        players: {
          ...players,
          [playerId]: {
            ...player,
            cards: {
              ...cards,
              [cardId]: {
                id: cardId,
                ...updatedCard,
                ...update,
              },
            },
          },
        },
      }
    }

    case 'ADD_LOG':
      return {
        ...state,
        logs: [...logs, action.message],
      }

    default:
      return state
  }
}
