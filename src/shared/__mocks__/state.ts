import store from 'src/shared/redux/store'
import { GameState } from 'src/Game/GameTypes'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import { MainState } from 'src/shared/redux/StateTypes'

const initialState = store.getState()

export const baseGameMockedState: MainState = {
  ...initialState,
  game: {
    ...initialState.game,
    turn: 1,
    topPlayer: MockPlayer1,
    bottomPlayer: MockPlayer2,
    activePlayerId: MockPlayer2.id
  }
}

export const emptyGameMockedState: GameState = {
  ...initialState.game,
  turn: 1,
  topPlayer: { ...MockPlayer1, hand: [] },
  bottomPlayer: { ...MockPlayer2, hand: [] },
  activePlayerId: MockPlayer2.id
}
