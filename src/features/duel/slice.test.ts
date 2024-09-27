import { DuelPhase, DuelState } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { normalizeArrayOfPlayers } from 'src/features/duel/utils'
import duelReducer, {
  drawCardFromDeck,
  endTurn,
  initializeEndTurn,
  initializeDuel,
  initialState,
  playCardFromHand,
  beginPlay,
  startRedraw,
  updateCard,
  putCardAtBottomOfDeck,
} from 'src/features/duel/slice'

import { HammeriteNovice, Haunt } from 'src/features/cards/CardPrototypes'
import { createPlayCardFromPrototype } from 'src/features/cards/utils'
import { PlayCard } from 'src/features/cards/types'

const initialPlayers = [MockPlayer1, MockPlayer2]
const normalizedPlayers = normalizeArrayOfPlayers(initialPlayers)

let mockDuelState: DuelState

describe('Initializing a duel', () => {
  beforeEach(() => {
    mockDuelState = { ...initialState }
  })

  test('initialize a new game with a random first player', () => {
    const state = duelReducer(
      mockDuelState,
      initializeDuel({
        players: initialPlayers,
        loggedInPlayerId: MockPlayer2.id,
      }),
    )

    const { turn, players, playerOrder, phase } = state

    expect(turn).toBe(0)
    expect([
      players[playerOrder[0]].isActive,
      players[playerOrder[1]].isActive,
    ]).toContain(true)
    expect(phase).toBe(DuelPhase.INITIAL_DRAW)
  })

  test('initialize a new game with a preset first player', () => {
    const firstPlayerId = initialPlayers[0].id
    const state = duelReducer(
      mockDuelState,
      initializeDuel({
        players: initialPlayers,
        firstPlayerId,
      }),
    )

    const { turn, players, phase } = state

    expect(turn).toBe(0)
    expect(players[firstPlayerId].isActive).toBeTruthy()
    expect(phase).toBe(DuelPhase.INITIAL_DRAW)
  })

  test('throw an error when initializing game if firstPlayerId is set to a non existent player', () => {
    expect(() => {
      duelReducer(
        mockDuelState,
        initializeDuel({
          players: initialPlayers,
          firstPlayerId: 'random-id',
        }),
      )
    }).toThrow()
  })
})

const playerId = MockPlayer1.id

describe('Sequence before play', () => {
  beforeEach(() => {
    mockDuelState = { ...initialState, players: { ...normalizedPlayers } }
  })

  test("draw a card from a player's deck if it has cards", () => {
    const mockDrawingPlayer = mockDuelState.players[playerId]

    mockDuelState.phase = DuelPhase.INITIAL_DRAW

    const state = duelReducer(mockDuelState, drawCardFromDeck(playerId))

    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length - 1)
    expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length + 1)
    expect(drawingPlayer.hand).toContain(mockDrawingPlayer.deck[0])
  })

  test('should draw no card if deck has no cards', () => {
    mockDuelState.phase = DuelPhase.INITIAL_DRAW

    mockDuelState.players = {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        hand: [],
        deck: [],
      },
      [MockPlayer2.id]: MockPlayer2,
    }

    const mockDrawingPlayer = mockDuelState.players[playerId]

    const state = duelReducer(mockDuelState, drawCardFromDeck(playerId))

    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length)
    expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length)
  })

  test('start redraw phase', () => {
    const state = duelReducer(mockDuelState, startRedraw())

    expect(state.phase).toBe(DuelPhase.REDRAW)
  })

  test('put a card from hand at the bottom of the deck', () => {
    mockDuelState.phase = DuelPhase.REDRAW

    const novice = createPlayCardFromPrototype(HammeriteNovice)

    const cardId = novice.id

    mockDuelState.players = {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        cards: {
          ...MockPlayer1.cards,
          [cardId]: novice,
        },
        hand: [cardId],
      },
      [MockPlayer2.id]: MockPlayer2,
    }

    const state = duelReducer(
      mockDuelState,
      putCardAtBottomOfDeck({
        playerId,
        cardId,
        from: 'hand',
      }),
    )

    const player = state.players[playerId]

    expect(player.hand).toHaveLength(0)
    expect(player.deck).toHaveLength(MockPlayer1.deck.length + 1)
    expect(player.deck).toContain(cardId)
  })

  test('start the game', () => {
    mockDuelState.phase = DuelPhase.REDRAW

    const state = duelReducer(mockDuelState, beginPlay())

    const { turn, phase } = state

    expect(turn).toBe(1)
    expect(phase).toBe(DuelPhase.PLAYER_TURN)
  })
})

describe('Playing turns', () => {
  beforeEach(() => {
    mockDuelState = {
      ...initialState,
      players: normalizedPlayers,
      turn: 1,
      phase: DuelPhase.PLAYER_TURN,
      playerOrder: [MockPlayer2.id, MockPlayer1.id],
    }
  })

  test('initialize end of turn resolution', () => {
    const state = duelReducer(mockDuelState, initializeEndTurn())

    expect(state.phase).toBe(DuelPhase.RESOLVING_END_TURN)
  })

  test('end of turn', () => {
    mockDuelState.phase = DuelPhase.RESOLVING_END_TURN

    mockDuelState.players = {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        isActive: true,
      },
      [MockPlayer2.id]: {
        ...MockPlayer2,
        isActive: false,
      },
    }

    const state = duelReducer(mockDuelState, endTurn())

    const { players, phase, turn } = state

    expect(turn).toBe(mockDuelState.turn + 1)
    expect(phase).toBe(DuelPhase.PLAYER_TURN)
    expect(players[MockPlayer1.id].isActive).toBe(
      !mockDuelState.players[MockPlayer1.id].isActive,
    )
    expect(players[MockPlayer2.id].isActive).toBe(
      !mockDuelState.players[MockPlayer2.id].isActive,
    )
  })

  test('play card from hand if active player', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const haunt = createPlayCardFromPrototype(Haunt)

    mockDuelState.players = {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        hand: [novice.id],
        cards: {
          [novice.id]: novice,
        },
        isActive: true,
      },
      [MockPlayer2.id]: {
        ...MockPlayer2,
        hand: [haunt.id],
        cards: {
          [haunt.id]: haunt,
        },
      },
    }

    const mockPlayingPlayer = mockDuelState.players[playerId]

    const state = duelReducer(
      mockDuelState,
      playCardFromHand({
        card: novice,
        playerId,
      }),
    )

    const playingPlayer = state.players[playerId]

    expect(playingPlayer.hand).toHaveLength(mockPlayingPlayer.hand.length - 1)
    expect(playingPlayer.board).toHaveLength(mockPlayingPlayer.board.length + 1)
    expect(playingPlayer.board).toContain(novice.id)
  })

  test('update a card', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const cardId = novice.id

    mockDuelState.players = {
      [MockPlayer1.id]: {
        ...MockPlayer1,
        board: [cardId],
        cards: {
          [cardId]: novice,
        },
        isActive: true,
      },
      [MockPlayer2.id]: MockPlayer2,
    }

    const update: Partial<PlayCard> = {
      cost: 1,
      strength: 5,
    }

    const state = duelReducer(
      mockDuelState,
      updateCard({
        playerId,
        cardId,
        update,
      }),
    )

    const updatedCard = state.players[playerId].cards[cardId]

    expect(updatedCard.strength).toBe(update.strength)
    expect(updatedCard.cost).toBe(update.cost)
  })
})
