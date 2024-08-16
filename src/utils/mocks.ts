import { CardState } from '../Cards/components/types'
import {
  Haunt,
  Zombie,
  ElevatedAcolyte,
  HammeriteNovice,
  DownwinderThief,
  BrotherSachelman
} from '../Cards/AllCards'
import { PlayCard } from '../Cards/types'
import { createPlayCardFromPrototype } from '../Cards/utils'
import { DEFAULT_COINS_AMOUNT } from '../Game/constants'
import { GameState, Player } from '../Game/types'
import { store } from '../state'
import { MainState } from '../state/types'

export const MockPlayer1: Player = {
  id: 'player1',
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  cards: [
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(ElevatedAcolyte)
  ]
}

export const MockPlayer2: Player = {
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT - 1,
  cards: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt)
  ]
}

export const MockCPUPlayer: Player = {
  id: 'playerCPU',
  name: 'Constantine',
  coins: DEFAULT_COINS_AMOUNT,
  cards: [createPlayCardFromPrototype(DownwinderThief)],
  isNonHuman: true
}

export const PlayTestPlayer1: Player = {
  id: 'player1',
  name: 'Victoria',
  coins: DEFAULT_COINS_AMOUNT,
  cards: [
    createPlayCardFromPrototype(BrotherSachelman),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(HammeriteNovice, CardState.OnBoard),
    createPlayCardFromPrototype(HammeriteNovice, CardState.OnBoard)
  ]
}

export const PlayTestPlayer2: Player = {
  id: 'player2',
  name: 'Hume',
  coins: DEFAULT_COINS_AMOUNT,
  isNonHuman: true,
  cards: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt)
  ]
}

export const mockCard: PlayCard = createPlayCardFromPrototype(Haunt)

const initialState = store.getState()

export const baseGameMockedState: MainState = {
  ...initialState,
  game: {
    ...initialState.game,
    turn: 1,
    topPlayer: MockPlayer1,
    bottomPlayer: MockPlayer2,
    activePlayerId: MockPlayer2.id
  }
}

export const emptyGameMockedState: GameState = {
  ...initialState.game,
  turn: 1,
  topPlayer: { ...MockPlayer1, cards: [] },
  bottomPlayer: { ...MockPlayer2, cards: [] },
  activePlayerId: MockPlayer2.id
}
