import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, Player, StartGamePayload } from './types'
import { PlayCard } from 'src/Cards/types'
import { EMPTY_PLAYER } from './constants'
import { coinToss } from 'src/utils/gameUtils'

export const initialState: GameState = {
  turn: 0,
  activePlayerId: '',
  topPlayer: EMPTY_PLAYER,
  bottomPlayer: EMPTY_PLAYER
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame: (state, action: PayloadAction<StartGamePayload>) => {
      const { topPlayer, bottomPlayer, isPlayerFirst } = action.payload

      const isBottomPlayerFirst = isPlayerFirst ?? coinToss()

      return {
        ...state,
        turn: 1,
        topPlayer,
        bottomPlayer,
        activePlayerId: isBottomPlayerFirst ? bottomPlayer.id : topPlayer.id
      }
    },
    endTurn: state => {
      const { turn, topPlayer, bottomPlayer, activePlayerId } = state

      const isBottomPlayerActive = bottomPlayer.id === activePlayerId

      return {
        ...state,
        turn: turn + 1,
        activePlayerId: isBottomPlayerActive ? topPlayer.id : bottomPlayer.id
      }
    },
    playCard: (state, action: PayloadAction<PlayCard['id']>) => {
      const { topPlayer, bottomPlayer, activePlayerId } = state
      const { payload: playedCardId } = action

      const players = [topPlayer, bottomPlayer].map(player => {
        const { hand, field } = player

        const playedCard = hand.find(card => card.id === playedCardId)

        if (playedCard && player.id === activePlayerId) {
          return {
            ...player,
            coins: player.coins - playedCard.cost,
            hand: hand.filter(card => card.id !== playedCard.id),
            field: [...field, playedCard]
          } as Player
        }

        return player as Player
      })

      return {
        ...state,
        topPlayer: players[0],
        bottomPlayer: players[1]
      }
    }
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
