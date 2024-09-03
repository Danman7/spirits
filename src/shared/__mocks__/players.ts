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

export const PlayTestPlayer1: Player = {
  ...MockPlayer1,
  coins: DEFAULT_COINS_AMOUNT,
  isActive: true
}

export const PlayTestPlayer2: Player = {
  ...MockPlayer2,
  coins: DEFAULT_COINS_AMOUNT,
  isCPU: true
}
