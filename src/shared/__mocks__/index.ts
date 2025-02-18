import {
  DuelState,
  initialState as initialDuelState,
  normalizePlayerCards,
  Player,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel'
import { Bot, User } from 'src/shared/types'

export const playerId = 'player'
export const opponentId = 'opponent'

export const userMock: User = {
  id: playerId,
  name: 'Garret',
  deck: [
    'BrotherSachelman',
    'HammeriteNovice',
    'HammeriteNovice',
    'ElevatedAcolyte',
    'ElevatedAcolyte',
    'TempleGuard',
    'TempleGuard',
    'YoraSkull',
    'HighPriestMarkander',
  ],
}

export const opponentMock: Bot = {
  id: opponentId,
  name: 'Karras',
  isBot: true,
  deck: [
    'Zombie',
    'Zombie',
    'Haunt',
    'Haunt',
    'ViktoriaThiefPawn',
    'AzaranTheCruel',
    'BookOfAsh',
  ],
}

export const initialPlayerMock: Player =
  setupInitialDuelPlayerFromUser(userMock)

export const initialOpponentMock: Player =
  setupInitialDuelPlayerFromUser(opponentMock)

export const initialDuelStateMock: DuelState = {
  ...initialDuelState,
  players: {
    [opponentId]: initialOpponentMock,
    [playerId]: initialPlayerMock,
  },
  playerOrder: [playerId, opponentId],
}

export const stackedPlayerMock: Player = {
  ...initialPlayerMock,
  income: 2,
  ...normalizePlayerCards({
    deck: ['HammeriteNovice', 'HighPriestMarkander'],
    hand: ['ElevatedAcolyte', 'YoraSkull'],
    board: ['TempleGuard'],
    discard: ['BrotherSachelman'],
  }),
}

export const stackedOpponentMock: Player = {
  ...initialOpponentMock,
  ...normalizePlayerCards({
    deck: ['BookOfAsh'],
    hand: ['Haunt', 'ViktoriaThiefPawn'],
    board: ['Zombie'],
    discard: ['AzaranTheCruel'],
  }),
}

export const stackedDuelStateMock: DuelState = {
  ...initialDuelState,
  phase: 'Player Turn',
  playerOrder: [playerId, opponentId],
  players: {
    [playerId]: stackedPlayerMock,
    [opponentId]: stackedOpponentMock,
  },
}
