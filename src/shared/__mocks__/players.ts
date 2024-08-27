import {
  AzaranTheCruel,
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  TempleGuard,
  ViktoriaThiefPawn,
  Zombie
} from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/Game/constants'
import { Player } from 'src/shared/redux/StateTypes'

export const MockPlayer1: Player = {
  ...EMPTY_PLAYER,
  id: 'player1',
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  isPlayerPrespective: true,
  deck: [
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(TempleGuard),
    createPlayCardFromPrototype(TempleGuard),
    createPlayCardFromPrototype(BrotherSachelman)
  ]
}

export const MockPlayer2: Player = {
  ...EMPTY_PLAYER,
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT - 1,
  deck: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt),
    createPlayCardFromPrototype(Haunt),
    createPlayCardFromPrototype(ViktoriaThiefPawn),
    createPlayCardFromPrototype(AzaranTheCruel),
    createPlayCardFromPrototype(BookOfAsh)
  ]
}

export const mockBudgetPlayer: Player = {
  ...EMPTY_PLAYER,
  id: 'player3',
  name: 'Hume',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [
    createPlayCardFromPrototype(TempleGuard),
    createPlayCardFromPrototype(HammeriteNovice)
  ]
}

export const PlayTestPlayer1: Player = {
  ...EMPTY_PLAYER,
  id: 'player1',
  name: 'Victoria',
  coins: DEFAULT_COINS_AMOUNT,
  isActive: true,
  isPlayerPrespective: true,
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
  isCPU: true,
  hand: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt)
  ],
  deck: [
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt)
  ]
}
