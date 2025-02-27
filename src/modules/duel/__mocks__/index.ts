import { initialState as initialDuelState } from 'src/modules/duel/state/duelReducer'
import { DuelState, Player } from 'src/modules/duel/types'
import {
  normalizePlayerCards,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel/utils'
import { Bot, User } from 'src/shared/modules/user/types'

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

const stackedPlayerMock: Player = {
  ...initialPlayerMock,
  income: 2,
  ...normalizePlayerCards({
    deck: ['HammeriteNovice', 'HighPriestMarkander'],
    hand: ['ElevatedAcolyte', 'YoraSkull'],
    board: ['TempleGuard'],
    discard: ['BrotherSachelman'],
  }),
}

const stackedOpponentMock: Player = {
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
