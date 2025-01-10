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

export const DEFAULT_DUEL_STARTING_COINS = 30
export const DEFAULT_DUEL_INITIAL_CARDS_DRAWN = 4

export const CARD_STACKS: CardStack[] = ['deck', 'hand', 'board', 'discard']
