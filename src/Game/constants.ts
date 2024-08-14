import { Player } from './types'

export const EMPTY_PLAYER: Player = {
  id: '',
  name: '',
  coins: 0,
  cards: []
}

export const DEFAULT_COINS_AMOUNT = 30

export const BOTTOM_HAND_ELEMENT_ID = 'bottom-hand'
export const BOTTOM_BOARD_ELEMENT_ID = 'bottom-board'
export const TOP_HAND_ELEMENT_ID = 'top-hand'
export const TOP_BOARD_ELEMENT_ID = 'top-board'
