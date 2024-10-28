import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { PlayCard } from 'src/features/cards/types'
import {
  drawCardFromDeckTransformer,
  initializeEndTurnTransformer,
  moveCardToBoardTransformer,
  moveCardToDiscardTransformer,
  moveToNextAttackerTransformer,
} from 'src/features/duel/transformers'
import {
  DuelPhase,
  DuelState,
  Player,
  PlayerCardAction,
} from 'src/features/duel/types'
import { getRandomArrayItem, shuffleArray } from 'src/shared/utils'

export const initialState: DuelState = {
  turn: 0,
  phase: 'Pre-duel',
  players: {},
  playerOrder: [],
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
        .map(({ id }) => id)

      state.phase = phase || 'Initial Draw'

      if (loggedInPlayerId) {
        state.loggedInPlayerId = loggedInPlayerId
      }
    },
    drawCardFromDeck: (state, action: PayloadAction<Player['id']>) => {
      drawCardFromDeckTransformer(state, action.payload)
    },
    startRedraw: (state) => {
      const { playerOrder } = state

      state.phase = 'Redrawing Phase'

      state.players[playerOrder[0]].hasPerformedAction = false
      state.players[playerOrder[1]].hasPerformedAction = false
    },
    putCardAtBottomOfDeck: (state, action: PlayerCardAction) => {
      const { cardId: movedCardId, playerId } = action.payload

      const { players } = state

      players[playerId].board = players[playerId].board.filter(
        (cardId) => cardId !== movedCardId,
      )
      players[playerId].hand = players[playerId].hand.filter(
        (cardId) => cardId !== movedCardId,
      )
      players[playerId].discard = players[playerId].discard.filter(
        (cardId) => cardId !== movedCardId,
      )

      players[playerId].deck.push(movedCardId)
    },
    completeRedraw: (state, action: PayloadAction<Player['id']>) => {
      const { players } = state

      players[action.payload].hasPerformedAction = true
    },
    beginPlay: (state) => {
      const { playerOrder, activePlayerId } = state

      state.phase = 'Player Turn'
      state.turn = 1

      state.players[playerOrder[0]].hasPerformedAction = false
      state.players[playerOrder[1]].hasPerformedAction = false

      drawCardFromDeckTransformer(state, activePlayerId)
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

      initializeEndTurnTransformer(state)
    },
    moveCardToBoard: (state, action: PlayerCardAction) => {
      moveCardToBoardTransformer(state, action)
    },
    updateCard: (
      state,
      action: PayloadAction<{
        playerId: Player['id']
        cardId: PlayCard['id']
        update: Partial<PlayCard>
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
  },
})

const { actions, reducer } = duelSlice

export const {
  initializeDuel,
  completeRedraw,
  drawCardFromDeck,
  initializeEndTurn,
  playCard,
  putCardAtBottomOfDeck,
  beginPlay,
  startRedraw,
  moveCardToBoard,
  updateCard,
  moveToNextAttacker,
  moveCardToDiscard,
} = actions

export type DuelActionTypes = `${typeof duelSlice.name}/${keyof typeof actions}`

export default reducer
