import { CardState } from '../Cards/components/types'
import {
  Haunt,
  Zombie,
  ElevatedAcolyte,
  HammeriteNovice,
  DownwinderThief,
  BrotherSachelman,
  TempleGuard
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
    createPlayCardFromPrototype(HammeriteNovice, CardState.InHand),
    createPlayCardFromPrototype(ElevatedAcolyte, CardState.InHand)
  ]
}

export const MockPlayer2: Player = {
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT - 1,
  cards: [
    createPlayCardFromPrototype(Zombie, CardState.InHand),
    createPlayCardFromPrototype(Haunt, CardState.InHand)
  ]
}

export const MockCPUPlayer: Player = {
  id: 'playerCPU',
  name: 'Constantine',
  coins: DEFAULT_COINS_AMOUNT,
  cards: [createPlayCardFromPrototype(DownwinderThief, CardState.InHand)],
  isNonHuman: true
}

export const PlayTestPlayer1: Player = {
  id: 'player1',
  name: 'Victoria',
  coins: DEFAULT_COINS_AMOUNT,
  cards: [
    createPlayCardFromPrototype(BrotherSachelman, CardState.InHand),
    createPlayCardFromPrototype(ElevatedAcolyte, CardState.InHand),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(TempleGuard),
    createPlayCardFromPrototype(TempleGuard),
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
    createPlayCardFromPrototype(Zombie, CardState.InHand),
    createPlayCardFromPrototype(Haunt),
    createPlayCardFromPrototype(Haunt, CardState.InHand)
  ]
}

export const mockCard: PlayCard = createPlayCardFromPrototype(
  Haunt,
  CardState.InHand
)

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
