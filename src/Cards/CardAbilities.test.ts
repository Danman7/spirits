import { baseGameMockedState } from 'src/utils/mocks'
import { ElevatedAcolyteOnPlay } from './CardAbilities'
import { GameState } from 'src/Game/types'
import { ElevatedAcolyte, HammeriteNovice } from './AllCards'
import { ELEVATED_ACOLYTE_BOOST } from './constants'

const baseGameState = baseGameMockedState.game

describe('Card abilities', () => {
  it('Elevated Acolyte should boost other Hammerite cards with lower strength', () => {
    const state: GameState = {
      ...baseGameState,
      bottomPlayer: {
        ...baseGameState.bottomPlayer,
        field: [{ ...ElevatedAcolyte, id: '1' }]
      }
    }

    expect(ElevatedAcolyteOnPlay(state)).toEqual(state)

    const boostableField = [
      { ...HammeriteNovice, id: '1' },
      { ...HammeriteNovice, id: '2' }
    ]

    state.bottomPlayer.field = boostableField

    expect(ElevatedAcolyteOnPlay(state)).toEqual({
      ...state,
      bottomPlayer: {
        ...state.bottomPlayer,
        field: [
          {
            ...boostableField[0],
            strength: boostableField[0].strength + ELEVATED_ACOLYTE_BOOST
          },
          {
            ...boostableField[1],
            strength: boostableField[1].strength + ELEVATED_ACOLYTE_BOOST
          }
        ]
      }
    })
  })
})
