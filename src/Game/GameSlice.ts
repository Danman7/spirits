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
    playCard: (state, action: PayloadAction<PlayCard['id']>) => {
      const { topPlayer, bottomPlayer, activePlayerId } = state
      const { payload: playedCardId } = action

      let playedCard: PlayCard | undefined

      const updatePlayer = (player: Player) => {
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
      }

      state.topPlayer = updatePlayer(topPlayer)
      state.bottomPlayer = updatePlayer(bottomPlayer)
      state.isCardPlayedThisTurn = true

      if (playedCard?.onPlayAbility) {
        OnPlayCardAbilitiesMap[playedCard.onPlayAbility](state)
      }
    }
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
