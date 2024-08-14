import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GameState, Player, StartGamePayload } from './types'
import { OnPlayAbility, PlayCard } from '../Cards/types'
import { EMPTY_PLAYER } from './constants'
import { coinToss } from '../utils/gameUtils'
import { CardState } from '../Cards/components/types'
import { OnPlayCardAbilitiesMap } from '../Cards/CardAbilities'

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

      const updatePlayer = (player: Player) => {
        const { cards } = player

        const playedCard = cards.find(card => card.id === playedCardId)

        if (playedCard && player.id === activePlayerId) {
          return {
            ...player,
            coins: player.coins - playedCard.cost,
            cards: cards.map(card => {
              if (card.id === playedCardId) {
                return {
                  ...card,
                  state: CardState.OnBoard
                }
              }

              return card
            })
          } as Player
        }

        return player as Player
      }

      state.topPlayer = updatePlayer(topPlayer)
      state.bottomPlayer = updatePlayer(bottomPlayer)
      state.isCardPlayedThisTurn = true
    },
    triggerOnPlayAbility: (state, action: PayloadAction<OnPlayAbility>) =>
      OnPlayCardAbilitiesMap[action.payload](state)
  }
})

export const GameActions = gameSlice.actions

export const GameReducer = gameSlice.reducer
