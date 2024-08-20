import { baseGameMockedState, emptyGameMockedState } from '../utils/mocks'
import { BrotherSachelmanOnPlay, HammeriteNoviceOnPlay } from './CardAbilities'
import { GameState } from '../Game/GameTypes'
import { HammeriteNovice, TempleGuard } from './AllCards'
import { ELEVATED_ACOLYTE_BOOST } from './constants'
import { createPlayCardFromPrototype } from './CardUtils'
const baseGameState = baseGameMockedState.game

describe('Card abilities', () => {
  it('Brother Sachelman should boost other Hammerite cards with lower strength', () => {
    const cardOnBoard = createPlayCardFromPrototype(TempleGuard)

    const state: GameState = baseGameState

    state.bottomPlayer.board = [...state.bottomPlayer.board, cardOnBoard]

    BrotherSachelmanOnPlay(state)

    expect(state.bottomPlayer.board).toEqual([cardOnBoard])

    const boostableBoard = [
      createPlayCardFromPrototype(HammeriteNovice),
      createPlayCardFromPrototype(HammeriteNovice)
    ]

    state.bottomPlayer.board = boostableBoard

    BrotherSachelmanOnPlay(state)

    expect(state.bottomPlayer.board).toEqual([
      {
        ...boostableBoard[0],
        strength:
          (boostableBoard[0].strength as number) + ELEVATED_ACOLYTE_BOOST
      },
      {
        ...boostableBoard[1],
        strength:
          (boostableBoard[1].strength as number) + ELEVATED_ACOLYTE_BOOST
      }
    ])
  })

  it('should spawn all Hammerite Novice copies if a Hammerite Novice is played and there is another allied Hammerite card on the board', () => {
    const state: GameState = emptyGameMockedState

    const hammeriteInPlay = createPlayCardFromPrototype(TempleGuard)
    const noviceInDeck = createPlayCardFromPrototype(HammeriteNovice)

    state.bottomPlayer.board = [hammeriteInPlay]
    state.bottomPlayer.deck = [noviceInDeck]

    HammeriteNoviceOnPlay(state)

    expect(state.bottomPlayer.board).toEqual([hammeriteInPlay, noviceInDeck])
    expect(state.bottomPlayer.deck).toEqual([])
  })
})
