import { GameReducer } from 'src/Game/GameSlice'
import { MainReducer } from './types'

export const reducer: MainReducer = {
  game: GameReducer
}
