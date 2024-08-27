import { Player } from 'src/shared/redux/StateTypes'

export const EMPTY_PLAYER: Player = {
  id: '',
  name: '',
  coins: 0,
  deck: [],
  hand: [],
  board: [],
  discard: [],
  isActive: false,
  hasPlayedCardThisTurn: false,
  isPlayerPrespective: false
}

export const DEFAULT_COINS_AMOUNT = 30
