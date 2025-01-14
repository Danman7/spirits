import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  DUEL_INCOME_PER_TURN,
  DUEL_INITIAL_CARDS_DRAWN,
} from 'src/features/duel/constants'
import { invalidFirstPlayerIdError } from 'src/features/duel/messages'
import {
  AddNewCardsAction,
  DuelCard,
  DuelStartUsers,
  DuelState,
  PlayerCardAction,
} from 'src/features/duel/types'
import {
  getAttackingAgentIndex,
  getInactivePlayerId,
  moveCardBetweenStacks,
  setupInitialDuelPlayerFromUser,
} from 'src/features/duel/utils'
import { getRandomArrayItem } from 'src/shared/utils'

export const initialState: DuelState = {
  phase: 'Initial Draw',
  players: {},
  attackingAgentId: '',
  activePlayerId: '',
  victoriousPlayerId: '',
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
      const { players } = state

      players[action.payload].hasPerformedAction = true
    },

    moveToNextTurn: (state) => {
      const { players, activePlayerId } = state

      Object.keys(players).forEach((playerId) => {
        state.players[playerId].hasPerformedAction = false

        if (state.phase === 'Resolving turn' && playerId !== activePlayerId) {
          state.activePlayerId = playerId
        }

        if (state.players[playerId].income) {
          state.players[playerId].coins += DUEL_INCOME_PER_TURN
          state.players[playerId].income -= DUEL_INCOME_PER_TURN
        }
      })

      state.phase = 'Player Turn'
      state.attackingAgentId = initialState.attackingAgentId

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
      state.attackingAgentId = players[activePlayerId].board[0] || ''
    },
    agentAttack: (state) => {
      const { players, activePlayerId, attackingAgentId } = state
      const defendingPlayer =
        players[getInactivePlayerId(players, activePlayerId)]
      const attackingCardIndex = getAttackingAgentIndex(
        players,
        activePlayerId,
        attackingAgentId,
      )

      // Prevent change if no attacker is set
      if (attackingCardIndex < 0) return

      // Set the defending agent to either the one opposite the attacker,
      // or the last agent on the defending player's board
      const defendingAgentId =
        defendingPlayer.board[attackingCardIndex] ||
        defendingPlayer.board[defendingPlayer.board.length - 1] ||
        ''

      // If there is a defending agent, damage it.
      // If not steal coins from the defending player.
      if (defendingAgentId) {
        state.players[defendingPlayer.id].cards[defendingAgentId].strength -= 1
      } else {
        state.players[defendingPlayer.id].coins -= 1
      }
    },
    moveToNextAttackingAgent: (state) => {
      const { players, activePlayerId, attackingAgentId } = state
      const activePlayer = players[activePlayerId]
      const currentAttackingAgentIndex = getAttackingAgentIndex(
        players,
        activePlayerId,
        attackingAgentId,
      )

      state.attackingAgentId =
        activePlayer.board[currentAttackingAgentIndex + 1] ||
        initialState.attackingAgentId
    },
    playCard: (state, action: PlayerCardAction) => {
      const { cardId: playedCardId, playerId } = action.payload
      const { players } = state
      const playedCard = players[playerId].cards[playedCardId]

      moveCardBetweenStacks({
        movedCardId: playedCardId,
        playerId,
        state,
        to: 'board',
      })

      players[playerId].coins = players[playerId].coins - playedCard.cost
      players[playerId].hasPerformedAction = true
    },
    moveCardToBoard: (state, action: PlayerCardAction) => {
      const { cardId: playedCardId, playerId } = action.payload

      moveCardBetweenStacks({
        movedCardId: playedCardId,
        playerId,
        state,
        to: 'board',
      })
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
      const { players } = state
      const { playerId, cards } = action.payload

      players[playerId].cards = {
        ...players[playerId].cards,
        ...cards,
      }
    },
    endDuel: (state, action: PayloadAction<string>) => {
      state.phase = 'Duel End'
      state.victoriousPlayerId = action.payload
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
  moveCardToBoard,
  updateCard,
  agentAttack,
  moveToNextAttackingAgent,
  discardCard,
  addNewCards,
  endDuel,
} = actions

export type DuelActionTypes = `${typeof duelSlice.name}/${keyof typeof actions}`

export const duelReducer = reducer
