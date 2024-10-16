import { Player } from 'src/features/duel/types'

export const EMPTY_PLAYER: Player = {
  id: '',
  name: '',
  coins: 0,
  income: 0,
  deck: [],
  hand: [],
  board: [],
  discard: [],
  cards: {},
  hasPlayedCardThisTurn: false,
}

export const DEFAULT_COINS_AMOUNT = 30
export const INITIAL_CARD_DRAW_AMOUNT = 4
export const SHORT_ANIMATION_CYCLE = 250
export const MEDIUM_ANIMATION_CYCLE = 500
export const LONG_ANIMATION_CYCLE = 1500

export const PLAYER_DECK_TEST_ID = 'player_deck_test_id'
export const PLAYER_DISCARD_TEST_ID = 'player_discard_test_id'
