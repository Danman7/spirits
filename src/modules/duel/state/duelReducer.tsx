import { INCOME_PER_TURN } from 'src/modules/duel/DuelConstants'
import {
  agentAttackLogMessage,
  agentRetaliatesLogMessage,
  discardLogMessage,
  hasDamagedSelfLogMessage,
  hasPlayedCardLogMessage,
  playerHasDrawnCardLogMessage,
  playerHasSkippedRedrawLogMessage,
  playersTurnLogMessage,
  reduceStrengthLogMessage,
  reducingCoinsLogMessage,
} from 'src/modules/duel/state/DuelStateMessages'
import { DuelAction, DuelState } from 'src/modules/duel/DuelTypes'
import {
  calculateAttackQueue,
  drawCardFromDeck,
  drawInitialCards,
  moveSingleCard,
  redrawCard,
  setInitialPlayerOrder,
  setPlayersFromUsers,
} from 'src/modules/duel/DuelUtils'
import { Agent } from 'src/shared/modules/cards/CardTypes'

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
      const player = players[playerId]

      return {
        ...state,
        players: {
          ...players,
          [playerId]: { ...player, hasPerformedAction: true },
        },
        logs: [
          ...logs,
          <p>
            <strong style={{ color: player.color }}>{player.name}</strong>
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
            <strong style={{ color: redrawingPlayer.color }}>
              {redrawingPlayer.name}
            </strong>
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
            <strong style={{ color: activePlayer.color }}>
              {activePlayer.name}
            </strong>
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
            <strong style={{ color: inactivePlayer.color }}>
              {inactivePlayer.name}
            </strong>
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
                <strong style={{ color: defendingPlayer.color }}>
                  {defendingPlayer.name}
                </strong>
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
      const { coins, name, color } = playingPlayer
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
            <strong style={{ color }}>{name}</strong>
            {hasPlayedCardLogMessage}
            <strong>{playedCardName}</strong> for {cost}.
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
        logs: [
          ...logs,
          <p>
            <strong>
              {discardingPlayer.cards[cardId].name}
              {discardLogMessage}
            </strong>
          </p>,
        ],
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

    case 'AGENT_DAMAGE_SELF': {
      const { amount, cardId, playerId } = action
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
                strength: updatedCard.strength - amount,
              },
            },
          },
        },
        logs: [
          ...logs,
          <p>
            <i>
              {updatedCard.name}
              {hasDamagedSelfLogMessage}
              {amount}
            </i>
          </p>,
        ],
      }
    }

    default:
      return state
  }
}
