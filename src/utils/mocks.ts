import { HammerHaunt, Zombie } from 'src/Cards/ChaosCards'
import { HammeriteAcolyte, HammeriteNovice } from 'src/Cards/OrderCards'
import { Player } from 'src/Game/types'

export const MockPlayer1: Player = {
  id: 'player1',
  name: 'Garret',
  deck: [
    { ...HammeriteAcolyte, id: '1' },
    { ...HammeriteNovice, id: '2' }
  ],
  field: []
}

export const MockPlayer2: Player = {
  id: 'player2',
  name: 'Karras',
  deck: [
    { ...Zombie, id: '11' },
    { ...HammerHaunt, id: '12' }
  ],
  field: []
}
