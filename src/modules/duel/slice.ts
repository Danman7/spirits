import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AttackOrder,
  CardStack,
  DUEL_INCOME_PER_TURN,
  DUEL_INITIAL_CARDS_DRAWN,
  DuelStartUsers,
  DuelState,
  invalidFirstPlayerIdError,
  moveCardBetweenStacks,
  PlayCardAction,
  PlayerAction,
  PlayerCardAction,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel'
import { Agent } from 'src/shared/types'
import { findCardBaseFromName, getRandomArrayItem } from 'src/shared/utils'

export const initialState: DuelState = {
  phase: 'Initial Draw',
  browsedStack: 'deck',
  attackingAgentId: '',
  activePlayerId: '',
  inactivePlayerId: '',
  victoriousPlayerId: '',
  isBrowsingStack: false,
  players: {},
  attackingQueue: [],
}

export const duelSlice = createSlice({
  name: 'duel',
  initialState,
  reducers: {
    startDuel: (
      state,
      action: PayloadAction<{
        users: DuelStartUsers
        firstPlayerId?: string
      }>,
    ) => {
      const { users, firstPlayerId } = action.payload

      if (firstPlayerId && !users.find(({ id }) => id === firstPlayerId))
        throw new Error(invalidFirstPlayerIdError)

      state.activePlayerId = firstPlayerId || getRandomArrayItem(users).id
      state.phase = 'Initial Draw'

      const { activePlayerId } = state

      state.players = users.reduce(
        (statePlayers: DuelState['players'], user) => {
          const { id } = user

          if (id !== activePlayerId) state.inactivePlayerId = id

          statePlayers[id] = setupInitialDuelPlayerFromUser(user)

          return statePlayers
        },
        {},
      )
    },

    playersDrawInitialCards: (state) => {
      const { players } = state

      Object.values(players).forEach(({ id, deck }) => {
        for (let index = 0; index < DUEL_INITIAL_CARDS_DRAWN; index++) {
          moveCardBetweenStacks({
            movedCardId: deck[index],
            playerId: id,
            state,
            to: 'hand',
          })
        }
      })

      state.phase = 'Redrawing'
    },

    drawACardFromDeck: (state, action: PlayerAction) => {
      const { playerId } = action.payload
      const { deck } = state.players[playerId]

      moveCardBetweenStacks({
        movedCardId: deck[0],
        playerId,
        state,
        to: 'hand',
      })
    },

    putACardAtBottomOfDeck: (state, action: PlayerCardAction) => {
      const { cardId: movedCardId, playerId } = action.payload

      moveCardBetweenStacks({
        playerId,
        movedCardId,
        state,
        to: 'deck',
      })
    },

    completeRedraw: (state, action: PlayerAction) => {
      const { playerId } = action.payload

      state.players[playerId].hasPerformedAction = true
    },

    startFirstPlayerTurn: (state) => {
      const { activePlayerId, inactivePlayerId, players } = state
      const { deck } = players[activePlayerId]

      state.phase = 'Player Turn'
      state.players[activePlayerId].hasPerformedAction = false
      state.players[inactivePlayerId].hasPerformedAction = false

      // Draw card on turn start
      moveCardBetweenStacks({
        movedCardId: deck[0],
        playerId: activePlayerId,
        state,
        to: 'hand',
      })
    },

    moveToNextTurn: (state) => {
      const { players, activePlayerId, inactivePlayerId } = state
      const { attackingAgentId, attackingQueue } = initialState

      state.phase = 'Player Turn'
      state.attackingAgentId = attackingAgentId
      state.attackingQueue = attackingQueue
      state.activePlayerId = inactivePlayerId
      state.inactivePlayerId = activePlayerId

      Object.keys(players).forEach((playerId) => {
        const { income } = state.players[playerId]

        state.players[playerId].hasPerformedAction = false

        // Handle income if any
        if (income) {
          state.players[playerId].coins += DUEL_INCOME_PER_TURN
          state.players[playerId].income -= DUEL_INCOME_PER_TURN
        }
      })

      // Draw card on turn start
      moveCardBetweenStacks({
        movedCardId: players[state.activePlayerId].deck[0],
        playerId: state.activePlayerId,
        state,
        to: 'hand',
      })
    },
    resolveTurn: (state) => {
      const { players, activePlayerId, inactivePlayerId } = state
      const { board: activePlayerBoard } = players[activePlayerId]

      state.phase = 'Resolving turn'

      state.attackingQueue = activePlayerBoard.reduce(
        (attackingQueue, attackerId, attackerIndex) => {
          const { board: defendingPlayerBoard, cards: defendingPlayerCards } =
            players[inactivePlayerId]

          // Set the defending agent to either the one opposite the attacker,
          // or the last agent on the defending player's board
          const defenderId =
            defendingPlayerBoard[attackerIndex] ||
            defendingPlayerBoard[defendingPlayerBoard.length - 1] ||
            ''

          const nextattackingQueue: AttackOrder[] = [
            ...attackingQueue,
            {
              attackerId,
              defenderId,
            },
          ]

          const defendingAgent = defendingPlayerCards[defenderId] as Agent

          // Handle retaliations
          if (defendingAgent.traits?.retaliates)
            nextattackingQueue.push({
              attackerId: defenderId,
              defenderId: attackerId,
            })

          return nextattackingQueue
        },
        [] as AttackOrder[],
      )

      const { attackingQueue } = state
      state.attackingAgentId = attackingQueue[0]?.attackerId || ''
    },
    agentAttack: (
      state,
      action: PayloadAction<{
        defendingPlayerId: string
        defendingAgentId?: string
      }>,
    ) => {
      const { defendingAgentId, defendingPlayerId } = action.payload

      // If there is a defending agent, damage it.
      // If not steal coins from the defending player.
      if (defendingAgentId) {
        ;(
          state.players[defendingPlayerId].cards[defendingAgentId] as Agent
        ).strength -= 1
      } else {
        state.players[defendingPlayerId].coins -= 1
      }
    },
    moveToNextAttackingAgent: (state) => {
      const { attackingQueue: oldQueue } = state
      const [, ...newQueue] = oldQueue

      state.attackingQueue = newQueue
      state.attackingAgentId = newQueue.length ? newQueue[0].attackerId : ''
    },
    playCard: (state, action: PlayCardAction) => {
      const { cardId: movedCardId, playerId, shouldPay } = action.payload
      const { players } = state
      const playedCard = players[playerId].cards[movedCardId]
      const { cost } = playedCard

      moveCardBetweenStacks({
        movedCardId,
        playerId,
        state,
        to: 'board',
      })

      players[playerId].hasPerformedAction = true

      if (shouldPay) {
        const { coins } = players[playerId]
        players[playerId].coins = coins - cost
      }
    },
    updateAgent: (
      state,
      action: PayloadAction<{
        playerId: string
        cardId: string
        update: Partial<Agent>
      }>,
    ) => {
      const { playerId, cardId, update } = action.payload

      if (state.players[playerId].cards[cardId].type !== 'agent') return

      state.players[playerId].cards[cardId] = {
        ...state.players[playerId].cards[cardId],
        ...update,
      }
    },
    discardCard: (state, action: PlayerCardAction) => {
      const { players } = state
      const { playerId, cardId: movedCardId } = action.payload

      moveCardBetweenStacks({
        movedCardId,
        playerId,
        state,
        to: 'discard',
      })

      const { cost } = players[playerId].cards[movedCardId]

      players[playerId].income += cost

      // Reset an agent's strength
      if (players[playerId].cards[movedCardId].type !== 'agent') return

      const { name } = players[playerId].cards[movedCardId]
      const base = findCardBaseFromName(name) as Agent

      players[playerId].cards[movedCardId].strength = base?.strength
    },
    endDuel: (state, action: PayloadAction<string>) => {
      state.phase = 'Duel End'
      state.victoriousPlayerId = action.payload
    },
    setBrowsedStack: (state, action: PayloadAction<CardStack>) => {
      state.browsedStack = action.payload
    },
    setIsBrowsingStack: (state, action: PayloadAction<boolean>) => {
      state.isBrowsingStack = action.payload
    },
  },
})

const { actions, reducer } = duelSlice

export const {
  startDuel,
  playersDrawInitialCards,
  completeRedraw,
  drawACardFromDeck,
  startFirstPlayerTurn,
  moveToNextTurn,
  resolveTurn,
  playCard,
  putACardAtBottomOfDeck,
  updateAgent,
  agentAttack,
  moveToNextAttackingAgent,
  discardCard,
  endDuel,
  setBrowsedStack,
  setIsBrowsingStack,
} = actions

export const duelReducer = reducer
