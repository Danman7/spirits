import { GameActions, GameReducer, initialState } from 'src/Game/GameSlice'
import { GameState } from 'src/Game/GameTypes'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'

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

  // it('should be able to draw a card', () => {
  //   const state = GameReducer(
  //     initialState,
  //     GameActions.startGame({ ...playersStartingTheGame, isPlayerFirst: false })
  //   )
  // })

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
    const playerHand = MockPlayer1.hand

    const state = GameReducer(
      gameStartedState,
      GameActions.playCard(playerHand[0])
    )

    const { topPlayer } = state

    expect(topPlayer.board).toEqual([playerHand[0]])

    expect(topPlayer.hand).toEqual([playerHand[1]])
  })

  it('should not be able to play a card if is not the active player', () => {
    const playerHand = MockPlayer2.hand

    const state = GameReducer(
      gameStartedState,
      GameActions.playCard(playerHand[0])
    )

    const { bottomPlayer } = state

    expect(bottomPlayer.board).toEqual([])

    expect(bottomPlayer.hand).toEqual(playerHand)
  })
})
