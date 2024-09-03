import { PlayersInGame } from 'src/shared/redux/StateTypes'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
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

export const initialPlayers: PlayersInGame = [
  {
    ...MockPlayer1,
    isActive: true,
    deck: [
      createPlayCardFromPrototype(TempleGuard),
      createPlayCardFromPrototype(TempleGuard),
      createPlayCardFromPrototype(ElevatedAcolyte)
    ],
    hand: [
      createPlayCardFromPrototype(BrotherSachelman),
      createPlayCardFromPrototype(ElevatedAcolyte)
    ],
    board: [
      createPlayCardFromPrototype(HammeriteNovice),
      createPlayCardFromPrototype(HammeriteNovice)
    ]
  },
  {
    ...MockPlayer2,
    deck: [
      createPlayCardFromPrototype(Zombie),
      createPlayCardFromPrototype(BookOfAsh),
      createPlayCardFromPrototype(AzaranTheCruel)
    ],
    hand: [
      createPlayCardFromPrototype(ViktoriaThiefPawn),
      createPlayCardFromPrototype(Haunt)
    ],
    board: [createPlayCardFromPrototype(Zombie)]
  }
]
