import {
  GameActions,
  GameReducer,
  initialState
} from 'src/shared/redux/reducers/GameReducer'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import {
  GamePhase,
  GameState,
  PlayerIndex,
  PlayerState
} from 'src/shared/redux/StateTypes'
import { createPlayCardFromPrototype } from 'src/Cards/CardUtils'
import { HammeriteNovice, Haunt } from 'src/Cards/CardPrototypes'
import { BrotherSachelmanOnPlay } from 'src/Cards/CardAbilities'

const initialPlayers: PlayerState = [MockPlayer1, MockPlayer2]

test('initialize a new game with a random first player', () => {
  const state = GameReducer(
    initialState,
    GameActions.initializeGame({ players: initialPlayers })
  )

  const { turn, players, phase } = state

  expect(turn).toBe(0)
  expect(players.find(({ isActive }) => !!isActive)).toBeTruthy()
  expect(phase).toBe(GamePhase.INITIAL_DRAW)
})

test('initialize a new game with a preset first player', () => {
  const state = GameReducer(
    initialState,
    GameActions.initializeGame({
      players: initialPlayers,
      firstPlayerId: initialPlayers[0].id
    })
  )

  const { turn, players, phase } = state

  expect(turn).toBe(0)
  expect(players).toEqual([
    { ...initialPlayers[0], isActive: true },
    initialPlayers[1]
  ])
  expect(phase).toBe(GamePhase.INITIAL_DRAW)
})

test('throw an error when initializing game if firstPlayerId is set to a non existent player', () => {
  expect(() => {
    GameReducer(
      initialState,
      GameActions.initializeGame({
        players: initialPlayers,
        firstPlayerId: 'random-id'
      })
    )
  }).toThrow()
})

test("draw a card from a player's deck if it has cards", () => {
  const drawingPlayerIndex: PlayerIndex = 0

  const mockState: GameState = {
    ...initialState,
    players: initialPlayers
  }

  const mockDrawingPlayer = mockState.players[drawingPlayerIndex]

  const state = GameReducer(
    mockState,
    GameActions.drawCardFromDeck(mockState.players[drawingPlayerIndex].id)
  )

  const { players } = state

  const drawingPlayer = players[drawingPlayerIndex]

  expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length - 1)
  expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length + 1)
  expect(drawingPlayer.hand).toContain(mockDrawingPlayer.deck[0])
})

test('should draw no card if deck has no cards', () => {
  const drawingPlayerIndex: PlayerIndex = 0

  const mockState: GameState = {
    ...initialState,
    players: [
      {
        ...initialPlayers[0],
        hand: [createPlayCardFromPrototype(HammeriteNovice)],
        deck: []
      },
      {
        ...initialPlayers[1],
        hand: [createPlayCardFromPrototype(Haunt)],
        deck: []
      }
    ]
  }

  const mockDrawingPlayer = mockState.players[drawingPlayerIndex]

  const state = GameReducer(
    mockState,
    GameActions.drawCardFromDeck(mockState.players[drawingPlayerIndex].id)
  )

  const { players } = state

  const drawingPlayer = players[drawingPlayerIndex]

  expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length)
  expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length)
})

test('start the game', () => {
  const mockState: GameState = {
    ...initialState,
    players: initialPlayers
  }

  const state = GameReducer(mockState, GameActions.startGame())

  const { turn, phase } = state

  expect(turn).toBe(1)
  expect(phase).toBe(GamePhase.PLAYER_TURN)
})

test('initialize end of turn resolution', () => {
  const mockState: GameState = {
    ...initialState,
    players: initialPlayers
  }

  const state = GameReducer(mockState, GameActions.initializeEndTurn())

  const { phase } = state

  expect(phase).toBe(GamePhase.RESOLVING_END_TURN)
})

test('end of turn', () => {
  const mockState: GameState = {
    turn: 1,
    phase: GamePhase.RESOLVING_END_TURN,
    players: [{ ...initialPlayers[0], isActive: true }, initialPlayers[1]]
  }

  const state = GameReducer(mockState, GameActions.endTurn())

  const { players, phase, turn } = state

  expect(turn).toBe(mockState.turn + 1)
  expect(phase).toBe(GamePhase.PLAYER_TURN)
  expect(players[0].isActive).toBe(!mockState.players[0].isActive)
  expect(players[1].isActive).toBe(!mockState.players[1].isActive)
})

const mockPlayCardState: GameState = {
  ...initialState,
  players: [
    {
      ...initialPlayers[0],
      hand: [createPlayCardFromPrototype(HammeriteNovice)]
    },
    {
      ...initialPlayers[1],
      hand: [createPlayCardFromPrototype(Haunt)]
    }
  ]
}

test('play card from hand if active player', () => {
  const playCardPlayerIndex: PlayerIndex = 0

  const mockPlayingPlayer = mockPlayCardState.players[playCardPlayerIndex]
  mockPlayingPlayer.isActive = true

  const playedCard = mockPlayingPlayer.hand[0]

  const state = GameReducer(
    mockPlayCardState,
    GameActions.playCardFromHand(playedCard)
  )

  const { players } = state

  const playingPlayer = players[playCardPlayerIndex]

  expect(playingPlayer.hand).toHaveLength(mockPlayingPlayer.hand.length - 1)
  expect(playingPlayer.board).toHaveLength(mockPlayingPlayer.board.length + 1)
  expect(playingPlayer.board).toContain(playedCard)
})

test('should throw an error if non active player tries to play a card', () => {
  const playCardPlayerIndex: PlayerIndex = 0

  const mockNonActivePlayer =
    mockPlayCardState.players[playCardPlayerIndex ? 0 : 1]
  mockNonActivePlayer.isActive = true

  const playedCard = mockNonActivePlayer.hand[0]

  expect(() => {
    GameReducer(initialState, GameActions.playCardFromHand(playedCard))
  }).toThrow()
})

test('trigger a card ability', () => {
  const mockState: GameState = {
    ...initialState,
    players: [
      {
        ...initialPlayers[0],
        hand: [
          createPlayCardFromPrototype(HammeriteNovice),
          createPlayCardFromPrototype(HammeriteNovice)
        ]
      },
      initialPlayers[1]
    ]
  }

  const expectedState = { ...mockState }
  BrotherSachelmanOnPlay(expectedState)

  const state = GameReducer(
    mockState,
    GameActions.triggerCardAbility('BrotherSachelmanOnPlay')
  )

  expect(state).toEqual(expectedState)
})
