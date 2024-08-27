import {
  BrotherSachelmanOnPlay,
  HammeriteNoviceOnPlay
} from 'src/Cards/CardAbilities'
import { HammeriteNovice, TempleGuard } from 'src/Cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { BROTHER_SACHELMAN_BOOST } from 'src/Cards/constants'
import { mockState } from 'src/shared/__mocks__/state'

it('Brother Sachelman should boost other Hammerite cards with lower strength', () => {
  const cardOnBoard = createPlayCardFromPrototype(TempleGuard)

  const state = mockState.game

  state.players[0].board = [cardOnBoard]

  BrotherSachelmanOnPlay(state)

  expect(state.players[0].board).toEqual([cardOnBoard])

  const boostableBoard = [
    createPlayCardFromPrototype(HammeriteNovice),
    createPlayCardFromPrototype(HammeriteNovice)
  ]

  state.players[0].board = boostableBoard

  BrotherSachelmanOnPlay(state)

  const { board } = state.players[0]

  expect(board[0].strength).toBe(
    (board[0].prototype.strength as number) + BROTHER_SACHELMAN_BOOST
  )
  expect(board[1].strength).toBe(
    (board[1].prototype.strength as number) + BROTHER_SACHELMAN_BOOST
  )
})

it('should spawn all Hammerite Novice copies if a Hammerite Novice is played and there is another allied Hammerite card on the board', () => {
  const state = mockState.game

  const hammeriteInPlay = createPlayCardFromPrototype(TempleGuard)
  const noviceInDeck = createPlayCardFromPrototype(HammeriteNovice)

  state.players[0].board = [hammeriteInPlay]
  state.players[0].deck = [noviceInDeck]

  HammeriteNoviceOnPlay(state)

  expect(state.players[0].board).toEqual([hammeriteInPlay, noviceInDeck])
  expect(state.players[0].deck).toEqual([])
})
