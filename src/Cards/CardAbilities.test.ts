import { baseGameMockedState } from 'src/utils/mocks'
import { ElevatedAcolyteOnPlay } from './CardAbilities'
import { GameState } from 'src/Game/types'
import { ElevatedAcolyte, HammeriteNovice } from './AllCards'
import { ELEVATED_ACOLYTE_BOOST } from './constants'
import { createPlayCardFromPrototype } from './utils'

const baseGameState = baseGameMockedState.game

describe('Card abilities', () => {
  it('Elevated Acolyte should boost other Hammerite cards with lower strength', () => {
    const state: GameState = {
      ...baseGameState,
      bottomPlayer: {
        ...baseGameState.bottomPlayer,
        field: [createPlayCardFromPrototype(ElevatedAcolyte)]
      }
    }

    expect(ElevatedAcolyteOnPlay(state)).toEqual(state)

    const boostableField = [
      createPlayCardFromPrototype(HammeriteNovice),
      createPlayCardFromPrototype(HammeriteNovice)
    ]

    state.bottomPlayer.field = boostableField

    expect(ElevatedAcolyteOnPlay(state)).toEqual({
      ...state,
      bottomPlayer: {
        ...state.bottomPlayer,
        field: [
          {
            ...boostableField[0],
            strength:
              (boostableField[0].strength as number) + ELEVATED_ACOLYTE_BOOST
          },
          {
            ...boostableField[1],
            strength:
              (boostableField[1].strength as number) + ELEVATED_ACOLYTE_BOOST
          }
        ]
      }
    })
  })
})
