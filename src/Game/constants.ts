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
export const BOTTOM_DECK_ELEMENT_ID = 'bottom-deck'
export const BOTTOM_GRAVEYARD_ELEMENT_ID = 'bottom-graveyard'
export const TOP_HAND_ELEMENT_ID = 'top-hand'
export const TOP_BOARD_ELEMENT_ID = 'top-board'
export const TOP_DECK_ELEMENT_ID = 'top-deck'
export const TOP_GRAVEYARD_ELEMENT_ID = 'top-graveyard'
