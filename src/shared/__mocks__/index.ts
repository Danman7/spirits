import { RootState } from 'src/app/store'
import {
  AzaranTheCruel,
  BookOfAsh,
  BrotherSachelman,
  ElevatedAcolyte,
  HammeriteNovice,
  Haunt,
  HighPriestMarkander,
  TempleGuard,
  ViktoriaThiefPawn,
  YoraSkull,
  Zombie,
} from 'src/features/cards/CardBases'
import { DEFAULT_COINS_AMOUNT, EMPTY_PLAYER } from 'src/features/duel/constants'
import { initialState } from 'src/features/duel/slice'
import { DuelState, Player } from 'src/features/duel/types'
import { normalizePlayerCards } from 'src/features/duel/utils'

export const playerId = 'player'
export const opponentId = 'opponent'

export const initialPlayerMock: Player = {
  ...EMPTY_PLAYER,
  id: playerId,
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  ...normalizePlayerCards({
    deck: [
      BrotherSachelman,
      HammeriteNovice,
      HammeriteNovice,
      ElevatedAcolyte,
      ElevatedAcolyte,
      TempleGuard,
      TempleGuard,
    ],
  }),
}

export const initialOpponentMock: Player = {
  ...EMPTY_PLAYER,
  id: opponentId,
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT,
  isCPU: true,
  ...normalizePlayerCards({
    deck: [
      Zombie,
      Zombie,
      Haunt,
      Haunt,
      ViktoriaThiefPawn,
      AzaranTheCruel,
      BookOfAsh,
    ],
  }),
}

export const stackedPlayerMock: Player = {
  ...initialPlayerMock,
  income: 2,
  ...normalizePlayerCards({
    deck: [HammeriteNovice, HighPriestMarkander],
    hand: [ElevatedAcolyte, YoraSkull],
    board: [TempleGuard],
    discard: [BrotherSachelman],
  }),
}

export const stackedOpponentMock: Player = {
  ...initialOpponentMock,
  ...normalizePlayerCards({
    deck: [ViktoriaThiefPawn],
    hand: [Haunt, BookOfAsh],
    board: [Zombie],
    discard: [AzaranTheCruel],
  }),
}

export const MockPlayerTurnState: DuelState = {
  loggedInPlayerId: initialPlayerMock.id,
  phase: 'Player Turn',
  activePlayerId: initialPlayerMock.id,
  attackingAgentId: '',
  players: {
    [stackedPlayerMock.id]: stackedPlayerMock,
    [stackedOpponentMock.id]: stackedOpponentMock,
  },
}

export const stackedDuelState: DuelState = {
  ...MockPlayerTurnState,
  players: {
    [stackedPlayerMock.id]: stackedPlayerMock,
    [opponentId]: MockPlayerTurnState.players[opponentId],
  },
}

export const stackedPreloadedState: RootState = {
  duel: { ...stackedDuelState },
}

export const mockRootState: RootState = {
  duel: initialState,
}
