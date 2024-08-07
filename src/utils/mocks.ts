import {
  Haunt,
  Zombie,
  ElevatedAcolyte,
  HammeriteNovice,
  DownwinderThief
} from 'src/Cards/AllCards'
import { PlayCard } from 'src/Cards/types'
import { DEFAULT_COINS_AMOUNT } from 'src/Game/constants'
import { Player } from 'src/Game/types'
import { store } from 'src/state'
import { MainState } from 'src/state/types'

export const MockPlayer1: Player = {
  id: 'player1',
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [
    { ...HammeriteNovice, id: '2' },
    { ...ElevatedAcolyte, id: '1' }
  ],
  field: []
}

export const MockPlayer2: Player = {
  id: 'player2',
  name: 'Karras',
  coins: DEFAULT_COINS_AMOUNT - 1,
  hand: [
    { ...Zombie, id: '11' },
    { ...Haunt, id: '12' }
  ],
  field: []
}

export const MockCPUPlayer: Player = {
  id: 'playerCPU',
  name: 'Constantine',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [{ ...DownwinderThief, id: '4' }],
  isNonHuman: true,
  field: []
}

export const PlayTestPlayer1: Player = {
  id: 'player1',
  name: 'Victoria',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [{ ...ElevatedAcolyte, id: '1' }],
  field: [{ ...HammeriteNovice, id: '2' }]
}

export const PlayTestPlayer2: Player = {
  id: 'player2',
  name: 'Hume',
  coins: DEFAULT_COINS_AMOUNT - 1,
  isNonHuman: true,
  hand: [
    { ...Zombie, id: '11' },
    { ...Haunt, id: '12' }
  ],
  field: []
}

export const mockCard: PlayCard = { ...Haunt, id: '1' }

const initialState = store.getState()

export const baseGameMockedState: MainState = {
  ...initialState,
  game: {
    ...initialState.game,
    turn: 1,
    topPlayer: MockPlayer1,
    bottomPlayer: MockPlayer2,
    activePlayerId: MockPlayer2.id
  }
}
