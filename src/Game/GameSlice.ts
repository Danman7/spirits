import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { GameState, Player, StartGamePayload } from 'src/Game/GameTypes'
import { EMPTY_PLAYER } from 'src/Game/constants'
import * as CardAbilities from 'src/Cards/CardAbilities'
import { CardAbility, PlayCard } from 'src/Cards/CardTypes'
import { coinToss } from 'src/shared/utils/utils'

export const initialState: GameState = {
  turn: 0,
  activePlayerId: '',
  topPlayer: EMPTY_PLAYER,
  bottomPlayer: EMPTY_PLAYER,
  isCardPlayedThisTurn: false
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<StartGamePayload>) => {
      const { topPlayer, bottomPlayer, isPlayerFirst } = action.payload

      const isBottomPlayerFirst = isPlayerFirst ?? coinToss()

      state.turn = 1
      state.activePlayerId = isBottomPlayerFirst
        ? bottomPlayer.id
        : topPlayer.id

      state.topPlayer = topPlayer
      state.bottomPlayer = bottomPlayer
    },
    endTurn: state => {
      const { topPlayer, bottomPlayer, activePlayerId } = state

      const isBottomPlayerActive = bottomPlayer.id === activePlayerId

      state.turn += 1
      state.activePlayerId = isBottomPlayerActive
        ? topPlayer.id
        : bottomPlayer.id
      state.isCardPlayedThisTurn = false
    },
    playCard: (state, action: PayloadAction<PlayCard>) => {
      const { topPlayer, bottomPlayer, activePlayerId } = state
      const {
        payload: { id: cardId }
      } = action

      const updatePlayer = (player: Player): Player => {
        const { id, hand, board, coins } = player

        const playedCard = hand.find(card => card.id === cardId)

        if (playedCard && id === activePlayerId) {
          return {
            ...player,
            coins: coins - playedCard.cost,
            hand: hand.filter(card => card.id !== cardId),
            board: [...board, playedCard]
          } as Player
        }

        return player as Player
      }

      state.topPlayer = updatePlayer(topPlayer)
      state.bottomPlayer = updatePlayer(bottomPlayer)
      state.isCardPlayedThisTurn = true
    },
    triggerCardAbility: (state, action: PayloadAction<CardAbility>) =>
      CardAbilities[action.payload](state)
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
