import { RootState } from 'src/app/store'
import { initialState as initialDuelState } from 'src/modules/duel/slice'
import { DuelState, Player } from 'src/modules/duel/types'
import {
  normalizePlayerCards,
  setupInitialDuelPlayerFromUser,
} from 'src/modules/duel/utils'
import { initialState as initialUserState } from 'src/modules/user/slice'
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
  activePlayerId: playerId,
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
  activePlayerId: playerId,
  players: {
    [stackedPlayerMock.id]: stackedPlayerMock,
    [stackedOpponentMock.id]: stackedOpponentMock,
  },
}

export const mockRootState: RootState = {
  duel: { ...initialDuelState },
  user: { ...initialUserState },
}

export const stackedStateMock: RootState = {
  duel: { ...stackedDuelStateMock },
  user: { ...userMock },
}
