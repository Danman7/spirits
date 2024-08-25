import { GameReducer } from 'src/Game/GameSlice'
import { MainReducer } from 'src/shared/redux/StateTypes'

export const reducer: MainReducer = {
  game: GameReducer
}
