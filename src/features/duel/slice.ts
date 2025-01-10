import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { DEFAULT_DUEL_INITIAL_CARDS_DRAWN } from 'src/features/duel/constants'
import {
  moveCardToBoardTransformer,
  moveCardToDiscardTransformer,
  moveToNextAttackerTransformer,
} from 'src/features/duel/transformers'
import {
  AddNewCardsAction,
  DuelCard,
  DuelStartUsers,
  DuelState,
  PlayerCardAction,
} from 'src/features/duel/types'
import {
  moveCardBetweenStacks,
  setupInitialDuelPlayerFromUser,
} from 'src/features/duel/utils'
import { getRandomArrayItem } from 'src/shared/utils'

export const initialState: DuelState = {
  phase: 'Initial Draw',
  players: {},
  attackingAgentId: '',
  activePlayerId: '',
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
        throw new Error('Invalid firstPlayerId passed to startDuel.')
      }

      state.activePlayerId = firstPlayerId || getRandomArrayItem(users).id

      state.phase = 'Initial Draw'
    },
    drawInitialCardsFromDeck: (state) => {
      Object.values(state.players).forEach(({ id, deck }) => {
        for (let index = 0; index < DEFAULT_DUEL_INITIAL_CARDS_DRAWN; index++) {
          moveCardBetweenStacks({
            movedCardId: deck[index],
            playerId: id,
            state,
            to: 'hand',
          })
        }
      })

      state.phase = 'Redrawing Phase'
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
      const { players, activePlayerId } = state

      players[action.payload].hasPerformedAction = true

      if (
        Object.values(players).every(
          ({ hasPerformedAction }) => !!hasPerformedAction,
        )
      ) {
        state.phase = 'Player Turn'

        Object.keys(players).forEach((playerId) => {
          state.players[playerId].hasPerformedAction = false
        })

        moveCardBetweenStacks({
          movedCardId: players[activePlayerId].deck[0],
          playerId: activePlayerId,
          state,
          to: 'hand',
        })
      }
    },

    initializeEndTurn: (state) => {
      state.phase = 'Resolving end of turn'

      moveToNextAttackerTransformer(state)
    },
    moveToNextAttacker: (state) => {
      moveToNextAttackerTransformer(state)
    },
    playCard: (state, action: PlayerCardAction) => {
      const { cardId: playedCardId, playerId } = action.payload
      const { players } = state

      moveCardToBoardTransformer(state, action)

      const playedCard = players[playerId].cards[playedCardId]

      players[playerId].coins = players[playerId].coins - playedCard.cost
      players[playerId].hasPerformedAction = true
    },
    moveCardToBoard: (state, action: PlayerCardAction) => {
      moveCardToBoardTransformer(state, action)
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

      if (state.players[playerId].cards[cardId].strength <= 0) {
        moveCardToDiscardTransformer(state, {
          payload: {
            cardId,
            playerId,
          },
        })
      }
    },
    moveCardToDiscard: (state, action: PlayerCardAction) => {
      moveCardToDiscardTransformer(state, action)
    },

    addNewCards: (state, action: AddNewCardsAction) => {
      const { players } = state
      const { playerId, cards } = action.payload

      players[playerId].cards = {
        ...players[playerId].cards,
        ...cards,
      }
    },
  },
})

const { actions, reducer } = duelSlice

export const {
  startDuel,
  drawInitialCardsFromDeck,
  completeRedraw,
  drawCardFromDeck,
  initializeEndTurn,
  playCard,
  putCardAtBottomOfDeck,
  moveCardToBoard,
  updateCard,
  moveToNextAttacker,
  moveCardToDiscard,
  addNewCards,
} = actions

export type DuelActionTypes = `${typeof duelSlice.name}/${keyof typeof actions}`

export const duelReducer = reducer
