import { baseGameMockedState } from '../utils/mocks'
import { ElevatedAcolyteOnPlay } from './CardAbilities'
import { GameState } from '../Game/types'
import { ElevatedAcolyte, HammeriteNovice } from './AllCards'
import { ELEVATED_ACOLYTE_BOOST } from './constants'
import { createPlayCardFromPrototype } from './utils'

const baseGameState = baseGameMockedState.game

describe('Card abilities', () => {
  it('Elevated Acolyte should boost other Hammerite cards with lower strength', () => {
    const baseField = [createPlayCardFromPrototype(ElevatedAcolyte)]
    const state: GameState = {
      ...baseGameState,
      bottomPlayer: {
        ...baseGameState.bottomPlayer,
        field: baseField
      }
    }

    ElevatedAcolyteOnPlay(state)

    expect(state.bottomPlayer.field).toEqual(baseField)

    const boostableField = [
      createPlayCardFromPrototype(HammeriteNovice),
      createPlayCardFromPrototype(HammeriteNovice)
    ]

    state.bottomPlayer.field = boostableField

    ElevatedAcolyteOnPlay(state)

    expect(state.bottomPlayer.field).toEqual([
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
    ])
  })
})
