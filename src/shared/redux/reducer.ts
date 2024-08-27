import { MainReducer } from 'src/shared/redux/StateTypes'
import { GameReducer } from 'src/shared/redux/reducers/GameReducer'

export const reducer: MainReducer = {
  game: GameReducer
}
