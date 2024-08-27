import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  GamePhase,
  GameState,
  Player,
  PlayerState,
  StartGamePayload
} from 'src/shared/redux/StateTypes'
import * as CardAbilities from 'src/Cards/CardAbilities'
import { CardAbility, PlayCard } from 'src/Cards/CardTypes'
import { EMPTY_PLAYER } from 'src/Game/constants'
import { getRandomArrayItem } from 'src/shared/utils/utils'

export const initialState: GameState = {
  turn: 0,
  phase: GamePhase.PRE_GAME,
  players: [EMPTY_PLAYER, EMPTY_PLAYER]
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    initializeGame: (state, action: PayloadAction<StartGamePayload>) => {
      const { players, firstPlayerId } = action.payload

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

      state.players = players.map(player => ({
        ...player,
        isActive: startingPlayerId === player.id
      })) as PlayerState

      state.phase = GamePhase.INITIAL_DRAW
    },
    drawCardFromDeck: (state, action: PayloadAction<Player['id']>) => {
      const { players } = state
      const playerToDrawACardId = action.payload

      state.players = players.map(player => ({
        ...player,
        hand:
          player.id === playerToDrawACardId && player.deck.length
            ? [...player.hand, player.deck.pop()]
            : player.hand
      })) as PlayerState
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
      })) as PlayerState
    },
    playCardFromHand: (state, action: PayloadAction<PlayCard>) => {
      const { players } = state
      const playedCard = action.payload

      if (
        !players
          .find(player => player.isActive)
          ?.hand.find(card => card.id === playedCard.id)
      ) {
        throw new Error(
          'Active player does not have card marked for play in thier hand.'
        )
      }

      state.players = players.map(player => ({
        ...player,
        coins: player.isActive ? player.coins - playedCard.cost : player.coins,
        hand: player.isActive
          ? player.hand.filter(card => card.id !== playedCard.id)
          : player.hand,
        board: player.isActive
          ? [...player.board, action.payload]
          : player.board,
        hasPlayedCardThisTurn: player.isActive
          ? true
          : player.hasPlayedCardThisTurn
      })) as PlayerState
    },
    triggerCardAbility: (state, action: PayloadAction<CardAbility>) =>
      CardAbilities[action.payload](state)
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
