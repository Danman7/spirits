import { MockPlayer1, MockPlayer2 } from '../utils/mocks'
import { GameActions, GameReducer, initialState } from './GameSlice'
import { GameState } from './types'
import { BrotherSachelman, HammeriteNovice } from '../Cards/AllCards'
import { BROTHER_SACHELMAN_BOOST } from '../Cards/constants'
import { createPlayCardFromPrototype } from '../Cards/utils'
import { getCardsInHand, getCardsOnBoard } from './utils'
import { CardState } from '../Cards/components/types'
import { OnPlayAbility } from '../Cards/types'

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
    const playerHand = getCardsInHand(MockPlayer1)

    const state = GameReducer(
      gameStartedState,
      GameActions.playCard(playerHand[0].id)
    )

    const { topPlayer } = state

    expect(getCardsOnBoard(topPlayer)).toEqual([
      { ...playerHand[0], state: CardState.OnBoard }
    ])

    expect(getCardsInHand(topPlayer)).toEqual([playerHand[1]])
  })

  it('should not be able to play a card if is not the active player', () => {
    const playerHand = getCardsInHand(MockPlayer2)

    const state = GameReducer(
      gameStartedState,
      GameActions.playCard(playerHand[0].id)
    )

    const { bottomPlayer } = state

    expect(getCardsOnBoard(bottomPlayer)).toEqual([])

    expect(getCardsInHand(bottomPlayer)).toEqual(playerHand)
  })

  it('should trigger on play effect on card if one is present', () => {
    const topPlayerBoard = [
      createPlayCardFromPrototype(HammeriteNovice, CardState.OnBoard),
      createPlayCardFromPrototype(HammeriteNovice, CardState.OnBoard)
    ]

    const playedCard = createPlayCardFromPrototype(BrotherSachelman)

    const mockGameState: GameState = { ...gameStartedState }

    mockGameState.topPlayer = {
      ...mockGameState.topPlayer,
      cards: [...topPlayerBoard, playedCard]
    }

    const state = GameReducer(
      mockGameState,
      GameActions.triggerOnPlayAbility(OnPlayAbility.BrotherSachelmanOnPlay)
    )

    expect(getCardsOnBoard(state.topPlayer)).toEqual([
      {
        ...topPlayerBoard[0],
        strength:
          (topPlayerBoard[0].strength as number) + BROTHER_SACHELMAN_BOOST
      },
      {
        ...topPlayerBoard[1],
        strength:
          (topPlayerBoard[1].strength as number) + BROTHER_SACHELMAN_BOOST
      }
    ])
  })
})
