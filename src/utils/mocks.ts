import {
  Haunt,
  Zombie,
  ElevatedAcolyte,
  HammeriteNovice,
  DownwinderThief,
  BrotherSachelman,
  TempleGuard
} from '../Cards/AllCards'
import { PlayCard } from '../Cards/CardTypes'
import { createPlayCardFromPrototype } from '../Cards/CardUtils'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from '../Game/constants'
import { GameState, Player } from '../Game/GameTypes'
import { store } from '../state'
import { MainState } from '../state/StateTypes'

export const MockPlayer1: Player = {
  ...EMPTY_PLAYER,
  id: 'player1',
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(ElevatedAcolyte)
  ]
}

export const MockPlayer2: Player = {
  ...EMPTY_PLAYER,
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT - 1,
  hand: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt)
  ]
}

export const MockCPUPlayer: Player = {
  ...EMPTY_PLAYER,
  id: 'playerCPU',
  name: 'Constantine',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [createPlayCardFromPrototype(DownwinderThief)],
  isNonHuman: true
}

export const PlayTestPlayer1: Player = {
  ...EMPTY_PLAYER,
  id: 'player1',
  name: 'Victoria',
  coins: DEFAULT_COINS_AMOUNT,
  deck: [
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(TempleGuard)
  ],
  hand: [
    createPlayCardFromPrototype(BrotherSachelman),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(TempleGuard)
  ],
  board: [
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(HammeriteNovice)
  ]
}

export const PlayTestPlayer2: Player = {
  ...EMPTY_PLAYER,
  id: 'player2',
  name: 'Hume',
  coins: DEFAULT_COINS_AMOUNT,
  isNonHuman: true,
  hand: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt)
  ],
  deck: [
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
  topPlayer: { ...MockPlayer1, hand: [] },
  bottomPlayer: { ...MockPlayer2, hand: [] },
  activePlayerId: MockPlayer2.id
}
