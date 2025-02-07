import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  CardStack,
  DUEL_INITIAL_CARDS_DRAWN,
  DuelStartUsers,
  DuelState,
  handleIncome,
  invalidFirstPlayerIdError,
  moveCardBetweenStacks,
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
  victoriousPlayerId: '',
  isBrowsingStack: false,
  players: {},
  playerOrder: ['', ''],
  attackingQueue: [],
}

export const duelSlice = createSlice({
  name: 'duel',
  initialState,
  reducers: {
    /*** Setup Sequence ***/

    startDuel: (
      state,
      action: PayloadAction<{ users: DuelStartUsers; firstPlayerId?: string }>,
    ) => {
      const { users, firstPlayerId } = action.payload
      if (firstPlayerId && !users.some(({ id }) => id === firstPlayerId))
        throw new Error(invalidFirstPlayerIdError)

      const activePlayerId = firstPlayerId || getRandomArrayItem(users).id
      const inactivePlayerId =
        users.find(({ id }) => id !== activePlayerId)?.id || ''

      state.players = Object.fromEntries(
        users.map((user) => [user.id, setupInitialDuelPlayerFromUser(user)]),
      )
      state.playerOrder = [activePlayerId, inactivePlayerId]
      state.phase = 'Initial Draw'
    },

    playersDrawInitialCards: (state) => {
      Object.values(state.players).forEach(({ id: playerId, deck }) => {
        deck.slice(0, DUEL_INITIAL_CARDS_DRAWN).forEach((movedCardId) =>
          moveCardBetweenStacks({
            movedCardId,
            playerId,
            state,
            to: 'hand',
          }),
        )
      })
      state.phase = 'Redrawing'
    },

    completeRedraw: (state, action: PlayerAction) => {
      state.players[action.payload.playerId].hasPerformedAction = true
    },

    startFirstPlayerTurn: (state) => {
      const { deck, id: playerId } = state.players[state.playerOrder[0]]
      state.phase = 'Player Turn'
      state.playerOrder.forEach(
        (id) => (state.players[id].hasPerformedAction = false),
      )

      moveCardBetweenStacks({
        movedCardId: deck[0],
        playerId,
        state,
        to: 'hand',
      })
    },

    /*** Turn Managemen ***/

    moveToNextTurn: (state) => {
      state.phase = 'Player Turn'
      state.attackingAgentId = ''
      state.attackingQueue = []
      state.playerOrder.reverse()

      state.playerOrder.forEach((id) => {
        state.players[id].hasPerformedAction = false
        handleIncome(state, id)
      })

      moveCardBetweenStacks({
        movedCardId: state.players[state.playerOrder[0]].deck[0],
        playerId: state.playerOrder[0],
        state,
        to: 'hand',
      })
    },

    resolveTurn: (state) => {
      state.phase = 'Resolving turn'
      const { players, playerOrder } = state
      const activePlayerBoard = players[playerOrder[0]].board

      state.attackingQueue = activePlayerBoard.flatMap((attackerId, index) => {
        const defenderId =
          players[playerOrder[1]].board[index] ||
          players[playerOrder[1]].board.at(-1) ||
          ''
        const queue = [{ attackerId, defenderId }]

        const defendingAgent = players[playerOrder[1]].cards[
          defenderId
        ] as Agent

        if (defendingAgent?.traits?.retaliates)
          queue.push({ attackerId: defenderId, defenderId: attackerId })

        return queue
      })

      state.attackingAgentId = state.attackingQueue[0]?.attackerId || ''
    },

    endDuel: (state, action: PayloadAction<string>) => {
      state.phase = 'Duel End'
      state.victoriousPlayerId = action.payload
    },

    /*** Attack Handling ***/

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
      state.attackingQueue.shift()
      state.attackingAgentId = state.attackingQueue[0]?.attackerId || ''
    },

    /*** Card Actions ***/

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

    playCard: (
      state,
      action: PayloadAction<{
        cardId: string
        playerId: string
        shouldPay: boolean
      }>,
    ) => {
      const { cardId: movedCardId, playerId, shouldPay } = action.payload
      const { cost } = state.players[playerId].cards[movedCardId]

      moveCardBetweenStacks({
        movedCardId,
        playerId,
        state,
        to: 'board',
      })

      state.players[playerId].hasPerformedAction = true
      if (shouldPay) state.players[playerId].coins -= cost
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
      if (state.players[playerId].cards[cardId]?.type === 'agent') {
        Object.assign(state.players[playerId].cards[cardId], update)
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

    /*** UI Management ***/

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
