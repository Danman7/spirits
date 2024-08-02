import { MainState } from 'src/state/types'
import { MockPlayer1, MockPlayer2 } from 'src/utils/mocks'
import { store } from 'src/state'

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
