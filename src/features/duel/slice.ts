import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  DuelPhase,
  DuelState,
  PlayCardFromHandAction,
  Player,
} from 'src/features/duel/types'

import { PlayCard } from 'src/features/cards/types'
import { getRandomArrayItem, shuffleArray } from 'src/shared/utils'

export const initialState: DuelState = {
  turn: 0,
  phase: DuelPhase.PRE_DUEL,
  players: {},
  playerOrder: [],
  loggedInPlayerId: '',
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

      state.players = players.reduce(
        (statePlayers: DuelState['players'], player) => {
          statePlayers[player.id] = {
            ...player,
            isActive: startingPlayerId === player.id,
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

      state.phase = phase || DuelPhase.INITIAL_DRAW

      if (loggedInPlayerId) {
        state.loggedInPlayerId = loggedInPlayerId
      }
    },
    drawCardFromDeck: (state, action: PayloadAction<Player['id']>) => {
      const { players } = state

      const drawingPlayer = players[action.payload]

      if (drawingPlayer.deck.length) {
        const drawnCardId = drawingPlayer.deck.shift()

        if (drawnCardId) {
          drawingPlayer.hand.push(drawnCardId)
        }
      }
    },
    startRedraw: (state) => {
      state.phase = DuelPhase.REDRAW
    },
    putCardAtBottomOfDeck: (
      state,
      action: PayloadAction<{
        cardId: PlayCard['id']
        playerId: Player['id']
        from: 'hand' | 'board' | 'discard'
      }>,
    ) => {
      const { cardId, playerId, from } = action.payload

      const { players } = state

      players[playerId][from] = players[playerId][from].filter(
        (id) => id !== cardId,
      )
      players[playerId].deck.push(cardId)
    },
    completeRedraw: (state, action: PayloadAction<Player['id']>) => {
      const { players } = state

      players[action.payload].isReady = true
    },
    beginPlay: (state) => {
      state.phase = DuelPhase.PLAYER_TURN
      state.turn = 1
    },
    initializeEndTurn: (state) => {
      state.phase = DuelPhase.RESOLVING_END_TURN
    },
    endTurn: (state) => {
      state.turn += 1
      state.phase = DuelPhase.PLAYER_TURN

      state.playerOrder.forEach((playerId) => {
        state.players[playerId].isActive = !state.players[playerId].isActive
        state.players[playerId].hasPlayedCardThisTurn = false
      })
    },
    playCardFromHand: (state, action: PlayCardFromHandAction) => {
      const {
        card: { id, cost },
        playerId,
      } = action.payload
      const { players } = state

      players[playerId].coins = players[playerId].coins - cost
      players[playerId].hasPlayedCardThisTurn = true
      players[playerId].hand = players[playerId].hand.filter(
        (cardId) => cardId !== id,
      )
      players[playerId].board = [...players[playerId].board, id]
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
    },
  },
})

const { actions, reducer } = duelSlice

export const {
  initializeDuel,
  completeRedraw,
  drawCardFromDeck,
  endTurn,
  initializeEndTurn,
  playCardFromHand,
  putCardAtBottomOfDeck,
  beginPlay,
  startRedraw,
  updateCard,
} = actions

export type DuelActionTypes = `${typeof duelSlice.name}/${keyof typeof actions}`

export default reducer
