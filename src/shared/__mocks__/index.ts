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
import { DuelState, Player } from 'src/features/duel/types'
import { normalizePlayerCards } from 'src/shared/utils'

export const MockPlayer1: Player = {
  ...EMPTY_PLAYER,
  id: 'player1',
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

export const MockPlayer2: Player = {
  ...EMPTY_PLAYER,
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT,
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

export const mockStackedPlayer: Player = {
  ...MockPlayerTurnState.players[MockPlayer1.id],
  income: 2,
  ...normalizePlayerCards({
    deck: [HammeriteNovice, HighPriestMarkander],
    hand: [ElevatedAcolyte, YoraSkull],
    board: [TempleGuard],
    discard: [BrotherSachelman],
  }),
}

export const stackedDuelState: DuelState = {
  ...MockPlayerTurnState,
  players: {
    [mockStackedPlayer.id]: mockStackedPlayer,
    [MockPlayerTurnState.playerOrder[0]]:
      MockPlayerTurnState.players[MockPlayerTurnState.playerOrder[0]],
  },
}

export const stackedPreloadedState: RootState = {
  duel: stackedDuelState,
}
