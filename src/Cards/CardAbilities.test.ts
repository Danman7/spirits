import { baseGameMockedState, emptyGameMockedState } from '../utils/mocks'
import { BrotherSachelmanOnPlay, HammeriteNoviceOnPlay } from './CardAbilities'
import { GameState } from '../Game/GameTypes'
import { HammeriteNovice, TempleGuard } from './AllCards'
import { ELEVATED_ACOLYTE_BOOST } from './constants'
import { createPlayCardFromPrototype } from './CardUtils'
import { getCardsOnBoard } from '../Game/GameUtils'
import { CardState } from './CardTypes'

const baseGameState = baseGameMockedState.game

describe('Card abilities', () => {
  it('Brother Sachelman should boost other Hammerite cards with lower strength', () => {
    const cardOnBoard = createPlayCardFromPrototype(
      TempleGuard,
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

  it('should spawn all Hammerite Novice copies if a Hammerite Novice is played and there is another allied Hammerite card on the board', () => {
    const state: GameState = emptyGameMockedState

    const hammeriteInPlay = createPlayCardFromPrototype(
      TempleGuard,
      CardState.OnBoard
    )
    const noviceInDeck = createPlayCardFromPrototype(HammeriteNovice)

    state.bottomPlayer.cards = [hammeriteInPlay, noviceInDeck]

    HammeriteNoviceOnPlay(state)

    expect(state.bottomPlayer.cards).toEqual([
      hammeriteInPlay,
      { ...noviceInDeck, state: CardState.OnBoard }
    ])
  })

  it('should spawn all Hammerite Novice copies if a Hammerite Novice is played and there is another opponent Hammerite card on the board', () => {
    const state: GameState = emptyGameMockedState

    const hammeriteInPlay = createPlayCardFromPrototype(
      TempleGuard,
      CardState.OnBoard
    )
    const noviceInDeck = createPlayCardFromPrototype(HammeriteNovice)

    state.topPlayer.cards = [hammeriteInPlay]
    state.bottomPlayer.cards = [noviceInDeck]

    HammeriteNoviceOnPlay(state)

    expect(state.bottomPlayer.cards).toEqual([
      { ...noviceInDeck, state: CardState.OnBoard }
    ])
  })
})
