import {
  BrotherSachelmanOnPlay,
  HammeriteNoviceOnPlay
} from 'src/Cards/CardAbilities'
import { HammeriteNovice, TempleGuard } from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { GameState } from 'src/Game/GameTypes'
import {
  baseGameMockedState,
  emptyGameMockedState
} from 'src/shared/__mocks__/state'

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

    const { board } = state.bottomPlayer

    expect(board[0].strength).toBe(
      (board[0].prototype.strength as number) + BROTHER_SACHELMAN_BOOST
    )
    expect(board[1].strength).toBe(
      (board[1].prototype.strength as number) + BROTHER_SACHELMAN_BOOST
    )
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
