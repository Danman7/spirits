import {
  Haunt,
  Zombie,
  ElevatedAcolyte,
  HammeriteNovice
} from 'src/Cards/AllCards'
import { DEFAULT_COINS_AMOUNT } from 'src/Game/constants'
import { Player } from 'src/Game/types'

export const MockPlayer1: Player = {
  id: 'player1',
  name: 'Garret',
  coins: DEFAULT_COINS_AMOUNT,
  hand: [
    { ...ElevatedAcolyte, id: '1' },
    { ...HammeriteNovice, id: '2' }
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
