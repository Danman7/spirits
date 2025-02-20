import {
  calculateAttackQueue,
  drawCardFromDeck,
  drawInitialCards,
  DuelAction,
  DuelState,
  haveBothPlayersDrawnCards,
  INCOME_PER_TURN,
  invalidFirstPlayerIdError,
  moveSingleCard,
  redrawCard,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel'
import { Agent } from 'src/shared/types'
import { getRandomArrayItem } from 'src/shared/utils'

export const initialState: DuelState = {
  players: {},
  playerOrder: ['', ''],
  attackingQueue: [],
  phase: 'Initial Draw',
}

export const duelReducer = (
  state: Readonly<DuelState>,
  action: DuelAction,
): DuelState => {
  const { playerOrder, players } = state
  const [activePlayerId, inactivePlayerId] = playerOrder
  const activePlayer = state.players[activePlayerId]
  const inactivePlayer = state.players[inactivePlayerId]

  switch (action.type) {
    case 'START_DUEL': {
      const { users, firstPlayerId } = action

      if (firstPlayerId && !users.some(({ id }) => id === firstPlayerId))
        throw new Error(invalidFirstPlayerIdError)

      const activePlayerId = firstPlayerId || getRandomArrayItem(users).id

      return {
        ...state,
        players: Object.fromEntries(
          users.map((user) => [user.id, setupInitialDuelPlayerFromUser(user)]),
        ),
        playerOrder: [
          activePlayerId,
          users.filter(({ id }) => id !== activePlayerId)[0].id,
        ],
      }
    }

    case 'DRAW_INITIAL_CARDS': {
      return {
        ...state,
        phase: 'Redrawing',
        players: haveBothPlayersDrawnCards(players)
          ? players
          : {
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

    case 'PLAYER_READY': {
      const { playerId } = action

      return {
        ...state,
        players: {
          ...players,
          [playerId]: { ...players[playerId], hasPerformedAction: true },
        },
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
            coins: inactivePlayer.coins + INCOME_PER_TURN,
          },
          [activePlayerId]: {
            ...activePlayer,
            hasPerformedAction: false,
          },
        },
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

      return {
        ...state,
        players: {
          ...players,
          [defendingPlayerId]: {
            ...defendingPlayer,
            coins: defendingAgentId ? coins : coins - 1,
            cards: defendingAgent
              ? {
                  ...cards,
                  [defendingAgentId]: {
                    id: defendingAgentId,
                    ...defendingAgent,
                    strength: defendingAgent?.strength - 1,
                  },
                }
              : cards,
          },
        },
      }
    }

    case 'MOVE_TO_NEXT_ATTACKER': {
      return {
        ...state,
        attackingQueue: state.attackingQueue.slice(1),
      }
    }

    case 'PLAY_CARD': {
      const { cardId, playerId, shouldPay } = action
      const playingPlayer = players[playerId]
      const { coins } = playingPlayer
      const { cost } = playingPlayer.cards[cardId]

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
            coins: shouldPay ? coins - cost : coins,
          },
        },
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

    default:
      return state
  }
}
