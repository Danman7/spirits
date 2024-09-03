import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  GamePhase,
  GameState,
  Player,
  PlayerIndex,
  PlayersInGame
} from 'src/shared/redux/StateTypes'
import { PlayCard } from 'src/Cards/CardTypes'
import { EMPTY_PLAYER } from 'src/Game/constants'
import { getRandomArrayItem } from 'src/shared/utils/utils'

export const initialState: GameState = {
  turn: 0,
  phase: GamePhase.PRE_GAME,
  players: [EMPTY_PLAYER, EMPTY_PLAYER],
  loggedInPlayerId: ''
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (
      state,
      action: PayloadAction<{
        players: PlayersInGame
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

      state.players = players
        .map(player => ({
          ...player,
          isActive: startingPlayerId === player.id
        }))
        .sort(
          (playerA, playerB) =>
            Number(playerA.id === loggedInPlayerId) -
            Number(playerB.id === loggedInPlayerId)
        ) as PlayersInGame

      state.phase = phase || GamePhase.INITIAL_DRAW

      if (loggedInPlayerId) {
        state.loggedInPlayerId = loggedInPlayerId
      }
    },
    drawCardFromDeck: (state, action: PayloadAction<PlayerIndex>) => {
      const { players } = state

      const drawingPlayer = players[action.payload]

      if (drawingPlayer.deck.length) {
        players[action.payload].hand = [
          ...drawingPlayer.hand,
          players[action.payload].deck.shift() as PlayCard
        ]
      }
    },
    startRedraw: state => {
      state.phase = GamePhase.REDRAW
    },
    putCardAtBottomOfDeck: (
      state,
      action: PayloadAction<{
        card: PlayCard
        playerIndex: PlayerIndex
      }>
    ) => {
      const { card, playerIndex } = action.payload

      const { players } = state

      players[playerIndex].deck.push(card)
    },
    completeRedraw: (state, action: PayloadAction<PlayerIndex>) => {
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
      const { players } = state

      state.turn += 1
      state.phase = GamePhase.PLAYER_TURN
      state.players = players.map(player => ({
        ...player,
        isActive: !player.isActive,
        hasPlayedCardThisTurn: false
      })) as PlayersInGame
    },
    playCardFromHand: (
      state,
      action: PayloadAction<{
        playedCard: PlayCard
        playerIndex: PlayerIndex
      }>
    ) => {
      const { playedCard, playerIndex } = action.payload
      const { players } = state

      players[playerIndex].coins = players[playerIndex].coins - playedCard.cost
      players[playerIndex].hasPlayedCardThisTurn = true
      players[playerIndex].hand = players[playerIndex].hand.filter(
        card => card.id !== playedCard.id
      )
      players[playerIndex].board = [...players[playerIndex].board, playedCard]
    }
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
