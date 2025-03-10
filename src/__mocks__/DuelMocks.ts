import { initialState as initialDuelState } from 'src/modules/duel/state/duelReducer'
import { DuelState, Player } from 'src/modules/duel/DuelTypes'
import {
  normalizePlayerCards,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel/DuelUtils'
import { Bot, User } from 'src/shared/modules/user/UserTypes'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'

export const playerId = 'player'
export const opponentId = 'opponent'

export const userMock: User = {
  id: playerId,
  name: 'Garret',
  color: defaultTheme.colors.primary,
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
  color: defaultTheme.colors.hilight,
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
