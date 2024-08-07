import { MockPlayer1, MockPlayer2 } from 'src/utils/mocks'
import { GameActions, GameReducer, initialState } from './GameSlice'
import { GameState } from './types'
import { HammeriteNovice } from 'src/Cards/AllCards'
import { ELEVATED_ACOLYTE_BOOST } from 'src/Cards/constants'

const playersStartingTheGame = {
  topPlayer: MockPlayer1,
  bottomPlayer: MockPlayer2
}

const gameStartedState: GameState = {
  ...playersStartingTheGame,
  turn: 1,
  activePlayerId: MockPlayer1.id,
  isCardPlayedThisTurn: false
}

describe('Game State Slice', () => {
  it('should setup initial game state on start', () => {
    const state = GameReducer(
      initialState,
      GameActions.startGame(playersStartingTheGame)
    )

    const { turn, topPlayer, bottomPlayer, activePlayerId } = state

    expect(turn).toEqual(1)
    expect(topPlayer).toEqual(MockPlayer1)
    expect(bottomPlayer).toEqual(MockPlayer2)
    expect([MockPlayer1.id, MockPlayer2.id]).toContain(activePlayerId)
  })

  it('should be able to optionally choose starting player', () => {
    const state = GameReducer(
      initialState,
      GameActions.startGame({ ...playersStartingTheGame, isPlayerFirst: false })
    )

    const { activePlayerId, topPlayer } = state

    expect(activePlayerId).toBe(topPlayer.id)

    const nextState = GameReducer(
      initialState,
      GameActions.startGame({ ...playersStartingTheGame, isPlayerFirst: true })
    )

    expect(nextState.activePlayerId).toBe(nextState.bottomPlayer.id)
  })

  it('should change the active player on turn end', () => {
    const state = GameReducer(gameStartedState, GameActions.endTurn())

    const { turn, activePlayerId } = state

    expect(turn).toEqual(2)
    expect(activePlayerId).toEqual(MockPlayer2.id)

    const updatedState = GameReducer(state, GameActions.endTurn())

    const { turn: updatedTurn, activePlayerId: updatedActivePlayerId } =
      updatedState

    expect(updatedTurn).toEqual(3)
    expect(updatedActivePlayerId).toEqual(MockPlayer1.id)
  })

  it('should be able to play a card if is the active player', () => {
    const state = GameReducer(
      gameStartedState,
      GameActions.playCard(MockPlayer1.hand[0].id)
    )

    const { topPlayer } = state

    const { field, hand } = topPlayer

    expect(field).toEqual([MockPlayer1.hand[0]])

    expect(hand).toEqual([MockPlayer1.hand[1]])
  })

  it('should not be able to play a card if is not the active player', () => {
    const state = GameReducer(
      gameStartedState,
      GameActions.playCard(MockPlayer2.hand[0].id)
    )

    const { bottomPlayer } = state

    const { field, hand } = bottomPlayer

    expect(field).toEqual([])

    expect(hand).toEqual(MockPlayer2.hand)
  })

  it('should trigger on play effect on card if one is present', () => {
    const topPlayerField = [
      { ...HammeriteNovice, id: '1' },
      { ...HammeriteNovice, id: '2' }
    ]

    const state = GameReducer(
      {
        ...gameStartedState,
        topPlayer: {
          ...gameStartedState.topPlayer,
          field: topPlayerField
        }
      },
      GameActions.playCard(MockPlayer1.hand[1].id)
    )

    const { field } = state.topPlayer

    expect(field).toEqual([
      {
        ...topPlayerField[0],
        strength: topPlayerField[0].strength + ELEVATED_ACOLYTE_BOOST
      },
      {
        ...topPlayerField[1],
        strength: topPlayerField[1].strength + ELEVATED_ACOLYTE_BOOST
      },
      MockPlayer1.hand[1]
    ])
  })
})
