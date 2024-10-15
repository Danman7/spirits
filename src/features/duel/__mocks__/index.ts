import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/features/duel/constants'
import { DuelState, Player } from 'src/features/duel/types'
import { initializeCardsAndDeck } from 'src/features/duel/utils'

import {
  HammeriteNovice,
  AzaranTheCruel,
  BrotherSachelman,
  ElevatedAcolyte,
  Haunt,
  TempleGuard,
  ViktoriaThiefPawn,
  Zombie,
} from 'src/features/cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'

export const MockPlayer1: Player = {
  ...EMPTY_PLAYER,
  id: 'player1',
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  ...initializeCardsAndDeck([
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(ElevatedAcolyte),
    createPlayCardFromPrototype(TempleGuard),
    createPlayCardFromPrototype(TempleGuard),
    createPlayCardFromPrototype(BrotherSachelman),
  ]),
}

export const MockPlayer2: Player = {
  ...EMPTY_PLAYER,
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT - 1,
  ...initializeCardsAndDeck([
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Zombie),
    createPlayCardFromPrototype(Haunt),
    createPlayCardFromPrototype(Haunt),
    createPlayCardFromPrototype(ViktoriaThiefPawn),
    createPlayCardFromPrototype(AzaranTheCruel),
  ]),
}

export const PlayTestPlayer1: Player = {
  ...MockPlayer1,
  coins: DEFAULT_COINS_AMOUNT,
}

export const PlayTestPlayer2: Player = {
  ...MockPlayer2,
  coins: DEFAULT_COINS_AMOUNT,
  isCPU: true,
}

export const MockPlayerTurnState: DuelState = {
  loggedInPlayerId: MockPlayer1.id,
  phase: 'Player Turn',
  playerOrder: [MockPlayer2.id, MockPlayer1.id],
  turn: 1,
  activePlayerId: MockPlayer1.id,
  attackingAgentId: '',
  players: {
    [MockPlayer1.id]: {
      ...EMPTY_PLAYER,
      id: MockPlayer1.id,
      name: 'Garret',
      coins: DEFAULT_COINS_AMOUNT,
    },
    [MockPlayer2.id]: {
      ...EMPTY_PLAYER,
      id: MockPlayer2.id,
      name: 'Karras',
      coins: DEFAULT_COINS_AMOUNT,
    },
  },
}
