import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'
import {
  drawCardFromDeckTransformer,
  moveCardToBoardTransformer,
  moveCardToDiscardTransformer,
  moveToNextAttackerTransformer,
} from 'src/features/duel/transformers'
import {
  AddNewCardsAction,
  DuelPhase,
  DuelState,
  Player,
  PlayerCardAction,
} from 'src/features/duel/types'
import { moveCardBetweenStacks } from 'src/features/duel/utils'
import { DuelCard } from 'src/shared/types'
import { getRandomArrayItem, shuffleArray } from 'src/shared/utils'

export const initialState: DuelState = {
  phase: 'Pre-duel',
  players: {},
  attackingAgentId: '',
  activePlayerId: '',
}

export const duelSlice = createSlice({
  name: 'duel',
  initialState,
  reducers: {
    initializeDuel: (
      state,
      action: PayloadAction<{
        players: Player[]
        firstPlayerId?: string
        phase?: DuelPhase
      }>,
    ) => {
      const { players, firstPlayerId, phase } = action.payload

      let startingPlayerId: string

      if (firstPlayerId) {
        const playerFromProp = players.find(({ id }) => id === firstPlayerId)

        if (playerFromProp) {
          startingPlayerId = playerFromProp.id
        } else {
          throw new Error(
            'The firstPlayerId prop does not match any of the player ids passed to initialize.',
          )
        }
      } else {
        startingPlayerId = getRandomArrayItem(players).id
      }

      state.activePlayerId = startingPlayerId

      state.players = players.reduce(
        (statePlayers: DuelState['players'], player) => {
          statePlayers[player.id] = {
            ...player,
            deck: shuffleArray(player.deck),
          }

          return statePlayers
        },
        {},
      )

      state.phase = phase || 'Pre-duel'
    },
    startInitialCardDraw: (state) => {
      state.phase = 'Initial Draw'

      Object.values(state.players).forEach(({ id }) => {
        for (let index = 0; index < INITIAL_CARD_DRAW_AMOUNT; index++) {
          drawCardFromDeckTransformer(state, id)
        }
      })

      state.phase = 'Redrawing Phase'

      Object.values(state.players).forEach(({ id }) => {
        state.players[id].hasPerformedAction = state.players[id].isCPU
          ? true
          : false
      })
    },
    drawCardFromDeck: (state, action: PayloadAction<string>) => {
      drawCardFromDeckTransformer(state, action.payload)
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

        Object.keys(state.players).forEach((playerId) => {
          state.players[playerId].hasPerformedAction = false
        })

        drawCardFromDeckTransformer(state, activePlayerId)
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
  initializeDuel,
  startInitialCardDraw,
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
