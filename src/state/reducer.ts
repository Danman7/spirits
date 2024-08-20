import { GameReducer } from '../Game/GameSlice'
import { MainReducer } from './StateTypes'

export const reducer: MainReducer = {
  game: GameReducer
}
