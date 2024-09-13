import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GamePhase, GameState, Player } from 'src/shared/redux/StateTypes'
import { PlayCard } from 'src/Cards/CardTypes'
import { getRandomArrayItem } from 'src/shared/utils/utils'

export const initialState: GameState = {
  turn: 0,
  phase: GamePhase.PRE_GAME,
  players: {},
  playerOrder: [],
  loggedInPlayerId: ''
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (
      state,
      action: PayloadAction<{
        players: Player[]
        loggedInPlayerId?: Player['id']
        firstPlayerId?: Player['id']
        phase?: GamePhase
      }>
    ) => {
      const { players, firstPlayerId, loggedInPlayerId, phase } = action.payload

      let startingPlayerId: Player['id']

      if (firstPlayerId) {
        const playerFromProp = players.find(({ id }) => id === firstPlayerId)

        if (playerFromProp) {
          startingPlayerId = playerFromProp.id
        } else {
          throw new Error(
            'The firstPlayerId prop does not match any of the player ids passed to initialize.'
          )
        }
      } else {
        startingPlayerId = getRandomArrayItem(players).id
      }

      state.players = players.reduce(
        (statePlayers: GameState['players'], player) => {
          statePlayers[player.id] = {
            ...player,
            isActive: startingPlayerId === player.id
          }

          return statePlayers
        },
        {}
      )

      state.playerOrder = players
        .sort(
          (playerA, playerB) =>
            Number(playerA.id === loggedInPlayerId) -
            Number(playerB.id === loggedInPlayerId)
        )
        .map(({ id }) => id)

      state.phase = phase || GamePhase.INITIAL_DRAW

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
    startRedraw: state => {
      state.phase = GamePhase.REDRAW
    },
    putCardAtBottomOfDeck: (
      state,
      action: PayloadAction<{
        cardId: PlayCard['id']
        playerId: Player['id']
      }>
    ) => {
      const { cardId, playerId } = action.payload

      const { players } = state

      players[playerId].deck.push(cardId)
    },
    completeRedraw: (state, action: PayloadAction<Player['id']>) => {
      const { players } = state

      players[action.payload].isReady = true
    },
    startGame: state => {
      state.phase = GamePhase.PLAYER_TURN
      state.turn = 1
    },
    initializeEndTurn: state => {
      state.phase = GamePhase.RESOLVING_END_TURN
    },
    endTurn: state => {
      state.turn += 1
      state.phase = GamePhase.PLAYER_TURN

      state.playerOrder.forEach(playerId => {
        state.players[playerId].isActive = !state.players[playerId].isActive
        state.players[playerId].hasPlayedCardThisTurn = false
      })
    },
    playCardFromHand: (
      state,
      action: PayloadAction<{
        card: PlayCard
        playerId: Player['id']
      }>
    ) => {
      const {
        card: { id, cost },
        playerId
      } = action.payload
      const { players } = state

      players[playerId].coins = players[playerId].coins - cost
      players[playerId].hasPlayedCardThisTurn = true
      players[playerId].hand = players[playerId].hand.filter(
        cardId => cardId !== id
      )
      players[playerId].board = [...players[playerId].board, id]
    }
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
