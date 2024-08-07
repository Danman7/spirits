import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, Player, StartGamePayload } from './types'
import { PlayCard } from 'src/Cards/types'
import { EMPTY_PLAYER } from './constants'
import { coinToss } from 'src/utils/gameUtils'
import { OnPlayCardAbilitiesMap } from 'src/Cards/CardAbilities'

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
        activePlayerId: isBottomPlayerActive ? topPlayer.id : bottomPlayer.id,
        isCardPlayedThisTurn: false
      }
    },
    playCard: (state, action: PayloadAction<PlayCard['id']>) => {
      const { topPlayer, bottomPlayer, activePlayerId } = state
      const { payload: playedCardId } = action

      let playedCard: PlayCard | undefined

      const players = [topPlayer, bottomPlayer].map(player => {
        const { hand, field } = player

        playedCard = hand.find(card => card.id === playedCardId) || playedCard

        if (playedCard && player.id === activePlayerId) {
          return {
            ...player,
            coins: player.coins - playedCard.cost,
            hand: hand.filter(card => card.id !== (playedCard as PlayCard).id),
            field: [...field, playedCard]
          } as Player
        }

        return player as Player
      })

      const updatedState: GameState = {
        ...state,
        topPlayer: players[0],
        bottomPlayer: players[1],
        isCardPlayedThisTurn: true
      }

      console.log(playedCard)

      if (playedCard?.onPlayAbility) {
        return OnPlayCardAbilitiesMap[playedCard.onPlayAbility](updatedState)
      }

      return updatedState
    }
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
