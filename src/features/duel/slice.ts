import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DuelCard } from 'src/features/cards/types'
import { INITIAL_CARD_DRAW_AMOUNT } from 'src/features/duel/constants'
import {
  drawCardFromDeckTransformer,
  initializeEndTurnTransformer,
  moveCardBetweenStacks,
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
  PlayerOrder,
} from 'src/features/duel/types'
import { getRandomArrayItem, shuffleArray } from 'src/shared/utils'

export const initialState: DuelState = {
  turn: 0,
  phase: 'Pre-duel',
  players: {},
  playerOrder: ['', ''],
  loggedInPlayerId: '',
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
        loggedInPlayerId?: Player['id']
        firstPlayerId?: Player['id']
        phase?: DuelPhase
      }>,
    ) => {
      const { players, firstPlayerId, loggedInPlayerId, phase } = action.payload

      let startingPlayerId: Player['id']

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

      state.playerOrder = players
        .sort(
          (playerA, playerB) =>
            Number(playerA.id === loggedInPlayerId) -
            Number(playerB.id === loggedInPlayerId),
        )
        .map(({ id }) => id) as PlayerOrder

      state.phase = phase || 'Pre-duel'

      if (loggedInPlayerId) {
        state.loggedInPlayerId = loggedInPlayerId
      }
    },
    startInitialCardDraw: (state) => {
      state.phase = 'Initial Draw'

      Object.values(state.players).forEach(({ id }) => {
        for (let index = 0; index < INITIAL_CARD_DRAW_AMOUNT; index++) {
          drawCardFromDeckTransformer(state, id)
        }
      })

      state.phase = 'Redrawing Phase'

      state.playerOrder.forEach((playerId) => {
        state.players[playerId].hasPerformedAction = state.players[playerId]
          .isCPU
          ? true
          : false
      })
    },
    drawCardFromDeck: (state, action: PayloadAction<Player['id']>) => {
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
    completeRedraw: (state, action: PayloadAction<Player['id']>) => {
      const { players, playerOrder, activePlayerId } = state

      const [opponentId, playerId] = playerOrder

      players[action.payload].hasPerformedAction = true

      if (
        Object.values(players).every(
          ({ hasPerformedAction }) => !!hasPerformedAction,
        )
      ) {
        state.phase = 'Player Turn'
        state.turn = 1

        state.players[opponentId].hasPerformedAction = false
        state.players[playerId].hasPerformedAction = false

        drawCardFromDeckTransformer(state, activePlayerId)
      }
    },
    initializeEndTurn: (state) => {
      initializeEndTurnTransformer(state)
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
        playerId: Player['id']
        cardId: DuelCard['id']
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

export default reducer
