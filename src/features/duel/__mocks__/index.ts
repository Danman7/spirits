import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/features/duel/constants'
import { DuelPhase, DuelState, Player } from 'src/features/duel/types'
import { initializeCardsAndDeck } from 'src/features/duel/utils'

import {
  HammeriteNovice,
  AzaranTheCruel,
  BookOfAsh,
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
    createPlayCardFromPrototype(BookOfAsh),
  ]),
}

const novice1 = createPlayCardFromPrototype(HammeriteNovice)
const novice2 = createPlayCardFromPrototype(HammeriteNovice)
const brother = createPlayCardFromPrototype(BrotherSachelman)

export const PlayTestPlayer1: Player = {
  ...EMPTY_PLAYER,
  cards: {
    [novice1.id]: novice1,
    [novice2.id]: novice2,
    [brother.id]: brother,
  },
  board: [novice1.id, novice2.id],
  hand: [brother.id],
  coins: DEFAULT_COINS_AMOUNT,
  isActive: true,
}

export const PlayTestPlayer2: Player = {
  ...MockPlayer2,
  coins: DEFAULT_COINS_AMOUNT,
  isCPU: true,
}

export const MockPlayerTurnState: DuelState = {
  loggedInPlayerId: MockPlayer1.id,
  phase: DuelPhase.PLAYER_TURN,
  playerOrder: [MockPlayer2.id, MockPlayer1.id],
  turn: 1,
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
