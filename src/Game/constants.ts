import { Player } from 'src/Game/GameTypes'

export const EMPTY_PLAYER: Player = {
  id: '',
  name: '',
  coins: 0,
  deck: [],
  hand: [],
  board: [],
  discard: []
}

export const DEFAULT_COINS_AMOUNT = 30
