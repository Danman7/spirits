import { GameReducer } from '../Game/GameSlice'
import { MainReducer } from './types'

export const reducer: MainReducer = {
  game: GameReducer
}
