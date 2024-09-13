import { Player } from 'src/shared/redux/StateTypes'

export const EMPTY_PLAYER: Player = {
  id: '',
  name: '',
  coins: 0,
  deck: [],
  hand: [],
  board: [],
  discard: [],
  cards: {},
  isActive: false,
  hasPlayedCardThisTurn: false
}

export const DEFAULT_COINS_AMOUNT = 30
export const INITIAL_CARD_DRAW_AMOUNT = 4
export const SHORT_ANIMATION_CYCLE = 500
export const LONG_ANIMATION_CYCLE = 1500
