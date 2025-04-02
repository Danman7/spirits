import { normalizeStateCards } from 'src/modules/duel/duel.utils'
import {
  DuelState,
  initialState as initialDuelState,
  setupPlayersFromUsers,
} from 'src/modules/duel/state'

import type { Bot, User } from 'src/shared/modules/user'

export const playerId = 'player'
export const opponentId = 'opponent'

export const userMock: User = {
  id: playerId,
  name: 'Garret',
  color: '#269',
  deck: [
    'BrotherSachelman',
    'HammeriteNovice',
    'HammeriteNovice',
    'ElevatedAcolyte',
    'ElevatedAcolyte',
    'TempleGuard',
    'TempleGuard',
    'HighPriestMarkander',
  ],
}

export const opponentMock: Bot = {
  id: opponentId,
  name: 'Karras',
  isBot: true,
  color: '#174',
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

export const initialDuelStateMock: DuelState = {
  ...initialDuelState,
  ...setupPlayersFromUsers([userMock, opponentMock]),
  playerOrder: [playerId, opponentId],
}

export const stackedDuelStateMock = normalizeStateCards(
  {
    ...initialDuelStateMock,
    phase: 'Player Turn',
    playerOrder: [playerId, opponentId],
  },
  {
    [playerId]: {
      deck: ['HammeriteNovice', 'HighPriestMarkander'],
      hand: ['ElevatedAcolyte', 'YoraSkull'],
      board: ['TempleGuard'],
      discard: ['BrotherSachelman'],
    },
    [opponentId]: {
      deck: ['BookOfAsh'],
      hand: ['Haunt', 'ViktoriaThiefPawn'],
      board: ['Zombie'],
      discard: ['AzaranTheCruel'],
    },
  },
)
