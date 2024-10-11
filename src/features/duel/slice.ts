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
      state.phase = 'Redrawing Phase'
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
      state.phase = 'Player Turn'
      state.turn = 1
    },
    initializeEndTurn: (state) => {
      state.phase = 'Resolving end of turn'
    },
    endTurn: (state) => {
      state.turn += 1
      state.phase = 'Player Turn'

      state.activePlayerId =
        state.playerOrder[0] === state.activePlayerId
          ? state.playerOrder[1]
          : state.playerOrder[0]

      state.playerOrder.forEach((playerId) => {
        state.players[playerId].hasPlayedCardThisTurn = false
      })
    },
    playCardFromHand: (state, action: PlayCardFromHandAction) => {
      const { cardId, playerId } = action.payload
      const { players } = state

      const playedCard = players[playerId].cards[cardId]

      players[playerId].coins = players[playerId].coins - playedCard.cost
      players[playerId].hasPlayedCardThisTurn = true
      players[playerId].hand = players[playerId].hand.filter(
        (cardId) => cardId !== playedCard.id,
      )
      players[playerId].board = [...players[playerId].board, playedCard.id]
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
