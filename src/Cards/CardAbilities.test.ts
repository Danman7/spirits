import { baseGameMockedState } from '../utils/mocks'
import { BrotherSachelmanOnPlay } from './CardAbilities'
import { GameState } from '../Game/types'
import { HammeriteNovice, TempleGuardsman } from './AllCards'
import { ELEVATED_ACOLYTE_BOOST } from './constants'
import { createPlayCardFromPrototype } from './utils'
import { CardState } from './components/types'
import { getCardsOnBoard } from '../Game/utils'

const baseGameState = baseGameMockedState.game

describe('Card abilities', () => {
  it('Brother Sachelman should boost other Hammerite cards with lower strength', () => {
    const cardOnBoard = createPlayCardFromPrototype(
      TempleGuardsman,
      CardState.OnBoard
    )

    const state: GameState = baseGameState

    state.bottomPlayer.cards = [...state.bottomPlayer.cards, cardOnBoard]

    BrotherSachelmanOnPlay(state)

    expect(getCardsOnBoard(state.bottomPlayer)).toEqual([cardOnBoard])

    const boostableField = [
      createPlayCardFromPrototype(HammeriteNovice, CardState.OnBoard),
      createPlayCardFromPrototype(HammeriteNovice, CardState.OnBoard)
    ]

    state.bottomPlayer.cards = boostableField

    BrotherSachelmanOnPlay(state)

    expect(getCardsOnBoard(state.bottomPlayer)).toEqual([
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
