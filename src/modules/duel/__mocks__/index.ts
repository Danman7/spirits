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
    'YoraSkull',
    'TempleGuard',
    'TempleGuard',
    'HighPriestMarkander',
  ],
}

export const opponentMock: User = {
  id: opponentId,
  name: 'Karras',
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

export const botMock: Bot = { ...opponentMock, isBot: true }

export const initialDuelStateMock: DuelState = {
  ...initialDuelState,
  ...setupPlayersFromUsers([userMock, opponentMock]),
  playerOrder: [playerId, opponentId],
}

export const initialDuelStateWithBotMock: DuelState = {
  ...initialDuelState,
  ...setupPlayersFromUsers([userMock, botMock]),
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
      discard: ['AzaranTheCruel', 'Zombie'],
    },
  },
)
