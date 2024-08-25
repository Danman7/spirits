import {
  BrotherSachelman,
  DownwinderThief,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  Zombie
} from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/Game/constants'
import { Player } from 'src/Game/GameTypes'

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
