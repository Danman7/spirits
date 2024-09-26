import { DuelPhase, DuelState } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { normalizeArrayOfPlayers } from 'src/features/duel/utils'
import duelReducer, {
  drawCardFromDeck,
  endTurn,
  initializeEndTurn,
  initializeGame,
  initialState,
  playCardFromHand,
  startGame,
  startRedraw
} from 'src/features/duel/slice'

import { HammeriteNovice, Haunt } from 'src/features/cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'

const initialPlayers = [MockPlayer1, MockPlayer2]
const normalizedPlayers = normalizeArrayOfPlayers(initialPlayers)

test('initialize a new game with a random first player', () => {
  const state = duelReducer(
    { ...initialState },
    initializeGame({
      players: initialPlayers,
      loggedInPlayerId: MockPlayer2.id
    })
  )

  const { turn, players, playerOrder, phase } = state

  expect(turn).toBe(0)
  expect([
    players[playerOrder[0]].isActive,
    players[playerOrder[1]].isActive
  ]).toContain(true)
  expect(phase).toBe(DuelPhase.INITIAL_DRAW)
})

test('initialize a new game with a preset first player', () => {
  const firstPlayerId = initialPlayers[0].id
  const state = duelReducer(
    { ...initialState },
    initializeGame({
      players: initialPlayers,
      firstPlayerId
    })
  )

  const { turn, players, phase } = state

  expect(turn).toBe(0)
  expect(players[firstPlayerId].isActive).toBeTruthy()
  expect(phase).toBe(DuelPhase.INITIAL_DRAW)
})

test('throw an error when initializing game if firstPlayerId is set to a non existent player', () => {
  expect(() => {
    duelReducer(
      { ...initialState },
      initializeGame({
        players: initialPlayers,
        firstPlayerId: 'random-id'
      })
    )
  }).toThrow()
})

test("draw a card from a player's deck if it has cards", () => {
  const drawingPlayerIndex = MockPlayer1.id

  const mockState: DuelState = {
    ...initialState,
    players: normalizedPlayers
  }

  const mockDrawingPlayer = mockState.players[drawingPlayerIndex]

  const state = duelReducer(mockState, drawCardFromDeck(drawingPlayerIndex))

  const { players } = state

  const drawingPlayer = players[drawingPlayerIndex]

  expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length - 1)
  expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length + 1)
  expect(drawingPlayer.hand).toContain(mockDrawingPlayer.deck[0])
})

test('should draw no card if deck has no cards', () => {
  const drawingPlayerIndex = MockPlayer1.id

  const mockState: DuelState = {
    ...initialState,
    players: {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        hand: [],
        deck: []
      },
      [MockPlayer1.id]: {
        ...MockPlayer2,
        hand: [],
        deck: []
      }
    }
  }

  const mockDrawingPlayer = mockState.players[drawingPlayerIndex]

  const state = duelReducer(mockState, drawCardFromDeck(drawingPlayerIndex))

  const { players } = state

  const drawingPlayer = players[drawingPlayerIndex]

  expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length)
  expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length)
})

test('start the game', () => {
  const mockState: DuelState = {
    ...initialState,
    players: normalizedPlayers
  }

  const state = duelReducer(mockState, startGame())

  const { turn, phase } = state

  expect(turn).toBe(1)
  expect(phase).toBe(DuelPhase.PLAYER_TURN)
})

test('start redraw phase', () => {
  const mockState: DuelState = {
    ...initialState,
    players: normalizedPlayers
  }

  const state = duelReducer(mockState, startRedraw())

  expect(state.phase).toBe(DuelPhase.REDRAW)
})

test('initialize end of turn resolution', () => {
  const mockState: DuelState = {
    ...initialState,
    players: normalizedPlayers
  }

  const state = duelReducer(mockState, initializeEndTurn())

  const { phase } = state

  expect(phase).toBe(DuelPhase.RESOLVING_END_TURN)
})

test('end of turn', () => {
  const mockState: DuelState = {
    ...initialState,
    turn: 1,
    phase: DuelPhase.RESOLVING_END_TURN,
    players: {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        isActive: true
      },
      [MockPlayer2.id]: {
        ...MockPlayer2,
        isActive: false
      }
    },
    playerOrder: [MockPlayer2.id, MockPlayer1.id],
    loggedInPlayerId: initialState.loggedInPlayerId
  }

  const state = duelReducer(mockState, endTurn())

  const { players, phase, turn } = state

  expect(turn).toBe(mockState.turn + 1)
  expect(phase).toBe(DuelPhase.PLAYER_TURN)
  expect(players[MockPlayer1.id].isActive).toBe(
    !mockState.players[MockPlayer1.id].isActive
  )
  expect(players[MockPlayer2.id].isActive).toBe(
    !mockState.players[MockPlayer2.id].isActive
  )
})

test('play card from hand if active player', () => {
  const hammerite = createPlayCardFromPrototype(HammeriteNovice)
  const haunt = createPlayCardFromPrototype(Haunt)

  const playerId = MockPlayer1.id

  const mockPlayCardState: DuelState = {
    ...initialState,
    players: {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        hand: [hammerite.id],
        cards: {
          [hammerite.id]: hammerite
        },
        isActive: true
      },
      [MockPlayer2.id]: {
        ...MockPlayer2,
        hand: [haunt.id],
        cards: {
          [haunt.id]: haunt
        }
      }
    },
    turn: 1,
    phase: DuelPhase.PLAYER_TURN,
    playerOrder: [MockPlayer2.id, MockPlayer1.id]
  }

  const mockPlayingPlayer = mockPlayCardState.players[playerId]

  const state = duelReducer(
    mockPlayCardState,
    playCardFromHand({
      card: hammerite,
      playerId
    })
  )

  const { players } = state

  const playingPlayer = players[playerId]

  expect(playingPlayer.hand).toHaveLength(mockPlayingPlayer.hand.length - 1)
  expect(playingPlayer.board).toHaveLength(mockPlayingPlayer.board.length + 1)
  expect(playingPlayer.board).toContain(hammerite.id)
})