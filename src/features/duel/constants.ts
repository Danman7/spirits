import { CardStack, Player } from 'src/features/duel/types'

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
  hasPerformedAction: false,
}

export const DEFAULT_COINS_AMOUNT = 30
export const INITIAL_CARD_DRAW_AMOUNT = 4
export const MODAL_TIMEOUT = process.env.NODE_ENV === 'test' ? 50 : 2000

export const CARD_STACKS: CardStack[] = ['deck', 'hand', 'board', 'discard']
