import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  DUEL_INCOME_PER_TURN,
  DUEL_INITIAL_CARDS_DRAWN,
} from 'src/modules/duel/constants'
import { invalidFirstPlayerIdError } from 'src/modules/duel/messages'
import {
  AddNewCardsAction,
  AttackOrder,
  CardStack,
  DuelCard,
  DuelStartUsers,
  DuelState,
  PlayCardAction,
  PlayerCardAction,
} from 'src/modules/duel/types'
import {
  getInactivePlayerId,
  moveCardBetweenStacks,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel/utils'
import { getRandomArrayItem } from 'src/shared/utils'

export const initialState: DuelState = {
  phase: 'Initial Draw',
  players: {},
  attackingAgentId: '',
  activePlayerId: '',
  attackingQueue: [],
  victoriousPlayerId: '',
  browsedStack: 'deck',
  isBrowsingStack: false,
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

      state.players = users.reduce(
        (statePlayers: DuelState['players'], user) => {
          statePlayers[user.id] = setupInitialDuelPlayerFromUser(user)

          return statePlayers
        },
        {},
      )

      if (firstPlayerId && !state.players[firstPlayerId]) {
        throw new Error(invalidFirstPlayerIdError)
      }

      state.activePlayerId = firstPlayerId || getRandomArrayItem(users).id
      state.phase = 'Initial Draw'
    },
    playersDrawInitialCards: (state) => {
      Object.values(state.players).forEach(({ id, deck }) => {
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
    drawCardFromDeck: (state, action: PayloadAction<string>) => {
      const { id, deck } = state.players[action.payload]

      moveCardBetweenStacks({
        movedCardId: deck[0],
        playerId: id,
        state,
        to: 'hand',
      })
    },
    putCardAtBottomOfDeck: (state, action: PlayerCardAction) => {
      const { cardId: movedCardId, playerId } = action.payload

      moveCardBetweenStacks({
        playerId,
        movedCardId,
        state,
        to: 'deck',
      })
    },
    completeRedraw: (state, action: PayloadAction<string>) => {
      state.players[action.payload].hasPerformedAction = true
    },

    moveToNextTurn: (state) => {
      const { players, activePlayerId, phase } = state

      Object.keys(players).forEach((playerId) => {
        state.players[playerId].hasPerformedAction = false

        if (phase === 'Resolving turn' && playerId !== activePlayerId) {
          state.activePlayerId = playerId
        }

        if (state.players[playerId].income) {
          state.players[playerId].coins += DUEL_INCOME_PER_TURN
          state.players[playerId].income -= DUEL_INCOME_PER_TURN
        }
      })

      state.phase = 'Player Turn'
      state.attackingAgentId = initialState.attackingAgentId
      state.attackingQueue = initialState.attackingQueue

      moveCardBetweenStacks({
        movedCardId: players[activePlayerId].deck[0],
        playerId: activePlayerId,
        state,
        to: 'hand',
      })
    },
    resolveTurn: (state) => {
      const { players, activePlayerId } = state

      state.phase = 'Resolving turn'
      state.attackingQueue = players[activePlayerId].board.reduce(
        (attackingQueue, attackerId, attackerIndex) => {
          const defendingPlayer =
            players[getInactivePlayerId(players, activePlayerId)]

          // Set the defending agent to either the one opposite the attacker,
          // or the last agent on the defending player's board
          const defenderId =
            defendingPlayer.board[attackerIndex] ||
            defendingPlayer.board[defendingPlayer.board.length - 1] ||
            ''

          const nextattackingQueue: AttackOrder[] = [
            ...attackingQueue,
            {
              attackerId,
              defenderId,
            },
          ]

          if (defenderId && defendingPlayer.cards[defenderId].retaliates) {
            nextattackingQueue.push({
              attackerId: defenderId,
              defenderId: attackerId,
            })
          }

          return nextattackingQueue
        },
        [] as AttackOrder[],
      )
      state.attackingAgentId = state.attackingQueue[0]?.attackerId || ''
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
        state.players[defendingPlayerId].cards[defendingAgentId].strength -= 1
      } else {
        state.players[defendingPlayerId].coins -= 1
      }
    },
    moveToNextAttackingAgent: (state) => {
      const { attackingQueue } = state

      const [, ...newQueue] = attackingQueue

      state.attackingQueue = newQueue

      state.attackingAgentId = state.attackingQueue.length
        ? state.attackingQueue[0].attackerId
        : ''
    },
    playCard: (state, action: PlayCardAction) => {
      const { cardId: playedCardId, playerId, shouldPay } = action.payload
      const { players } = state
      const playedCard = players[playerId].cards[playedCardId]

      moveCardBetweenStacks({
        movedCardId: playedCardId,
        playerId,
        state,
        to: 'board',
      })

      players[playerId].hasPerformedAction = true

      if (shouldPay) {
        players[playerId].coins = players[playerId].coins - playedCard.cost
      }
    },
    updateCard: (
      state,
      action: PayloadAction<{
        playerId: string
        cardId: string
        update: Partial<DuelCard>
      }>,
    ) => {
      const { playerId, cardId, update } = action.payload

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

      const discardedCard = players[playerId].cards[movedCardId]

      if (discardedCard.base.strength) {
        players[playerId].cards[movedCardId].strength =
          discardedCard.base.strength
      }

      players[playerId].income += discardedCard.cost
    },
    addNewCards: (state, action: AddNewCardsAction) => {
      const { playerId, cards } = action.payload

      state.players[playerId].cards = {
        ...state.players[playerId].cards,
        ...cards,
      }
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
  drawCardFromDeck,
  moveToNextTurn,
  resolveTurn,
  playCard,
  putCardAtBottomOfDeck,
  updateCard,
  agentAttack,
  moveToNextAttackingAgent,
  discardCard,
  addNewCards,
  endDuel,
  setBrowsedStack,
  setIsBrowsingStack,
} = actions

export const duelReducer = reducer
