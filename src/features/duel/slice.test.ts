import { DuelState } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { normalizeArrayOfPlayers } from 'src/features/duel/utils'
import duelReducer, {
  drawCardFromDeck,
  endTurn,
  initializeEndTurn,
  initializeDuel,
  initialState,
  playCard,
  beginPlay,
  startRedraw,
  updateCard,
  putCardAtBottomOfDeck,
  agentAttacksPlayer,
  agentAttacksAgent,
  moveToNextAttacker,
  moveCardToDiscard,
} from 'src/features/duel/slice'

import {
  HammeriteNovice,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardPrototypes'
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

    const { turn, activePlayerId, phase } = state

    expect(turn).toBe(0)
    expect(activePlayerId).toBeTruthy()
    expect(phase).toBe('Initial Draw')
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

    const { turn, activePlayerId, phase } = state

    expect(turn).toBe(0)
    expect(activePlayerId).toBe(firstPlayerId)
    expect(phase).toBe('Initial Draw')
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
const opponentId = MockPlayer2.id

describe('Sequence before play', () => {
  beforeEach(() => {
    mockDuelState = {
      ...initialState,
      players: { ...normalizedPlayers },
      activePlayerId: playerId,
    }
  })

  test("draw a card from a player's deck if it has cards", () => {
    const mockDrawingPlayer = mockDuelState.players[playerId]

    mockDuelState.phase = 'Initial Draw'

    const state = duelReducer(mockDuelState, drawCardFromDeck(playerId))

    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length - 1)
    expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length + 1)
    expect(drawingPlayer.hand).toContain(mockDrawingPlayer.deck[0])
  })

  test('should draw no card if deck has no cards', () => {
    mockDuelState.phase = 'Initial Draw'

    mockDuelState.players = {
      [playerId]: {
        ...MockPlayer1,
        hand: [],
        deck: [],
      },
      [opponentId]: MockPlayer2,
    }

    const mockDrawingPlayer = mockDuelState.players[playerId]

    const state = duelReducer(mockDuelState, drawCardFromDeck(playerId))

    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(mockDrawingPlayer.deck.length)
    expect(drawingPlayer.hand).toHaveLength(mockDrawingPlayer.hand.length)
  })

  test('start redraw phase', () => {
    const state = duelReducer(mockDuelState, startRedraw())

    expect(state.phase).toBe('Redrawing Phase')
  })

  test('put a card at the bottom of the deck', () => {
    mockDuelState.phase = 'Redrawing Phase'

    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const cardId = novice.id
    const stacks = ['hand', 'board', 'discard']

    stacks.forEach((stack: 'hand' | 'board' | 'discard') => {
      mockDuelState.players = {
        [playerId]: {
          ...MockPlayer1,
          cards: {
            ...MockPlayer1.cards,
            [cardId]: novice,
          },
          [stack]: [cardId],
        },
        [opponentId]: MockPlayer2,
      }

      const state = duelReducer(
        mockDuelState,
        putCardAtBottomOfDeck({
          playerId,
          cardId,
        }),
      )

      const player = state.players[playerId]

      expect(player[stack]).toHaveLength(0)
      expect(player.deck).toHaveLength(MockPlayer1.deck.length + 1)
      expect(player.deck).toContain(cardId)
    })
  })

  test('start the game', () => {
    mockDuelState.phase = 'Redrawing Phase'

    const state = duelReducer(mockDuelState, beginPlay())

    const { turn, phase } = state

    expect(turn).toBe(1)
    expect(phase).toBe('Player Turn')
  })
})

describe('Playing turns', () => {
  beforeEach(() => {
    mockDuelState = {
      ...initialState,
      activePlayerId: playerId,
      players: normalizedPlayers,
      turn: 1,
      phase: 'Player Turn',
      playerOrder: [opponentId, playerId],
    }
  })

  test('initialize end of turn resolution if active player has no units on board', () => {
    const mockState: DuelState = {
      ...mockDuelState,
      players: {
        [playerId]: {
          ...mockDuelState.players[playerId],
          board: [],
        },
        [opponentId]: mockDuelState.players[opponentId],
      },
    }

    const state = duelReducer(mockState, initializeEndTurn())

    const { phase, attackingAgentId } = state

    expect(phase).toBe('Resolving end of turn')
    expect(attackingAgentId).toBe('')
  })

  test('initialize end of turn resolution if active player has units on board', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockDuelState.players = {
      [playerId]: {
        ...mockDuelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: mockDuelState.players[opponentId],
    }

    const state = duelReducer(mockDuelState, initializeEndTurn())

    const { phase, attackingAgentId } = state

    expect(phase).toBe('Resolving end of turn')
    expect(attackingAgentId).toBe(novice.id)
  })

  test('agent attacking player', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)

    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.players = {
      [playerId]: {
        ...mockDuelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: mockDuelState.players[opponentId],
    }

    const state = duelReducer(
      mockDuelState,
      agentAttacksPlayer({
        attackingCardId: novice.id,
        attackinPlayerId: playerId,
        defendingPlayerId: opponentId,
      }),
    )

    const { players } = state

    expect(players[opponentId].coins).toBe(MockPlayer2.coins - 1)
  })

  test('agent attacking agent', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const zombie = createPlayCardFromPrototype(Zombie)

    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.players = {
      [playerId]: {
        ...mockDuelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: {
        ...mockDuelState.players[opponentId],
        cards: {
          [zombie.id]: zombie,
        },
        deck: [],
        board: [zombie.id],
      },
    }

    const state = duelReducer(
      mockDuelState,
      agentAttacksAgent({
        attackingCardId: novice.id,
        attackinPlayerId: playerId,
        defendingPlayerId: opponentId,
        defendingCardId: zombie.id,
      }),
    )

    const { players } = state

    expect(players[opponentId].cards[zombie.id].strength).toBe(
      Zombie.strength - 1,
    )
  })

  test('move to next attacker', () => {
    const nextAttackerId = 'test'
    const state = duelReducer(mockDuelState, moveToNextAttacker(nextAttackerId))

    const { attackingAgentId } = state

    expect(attackingAgentId).toBe(nextAttackerId)
  })

  test('end of turn', () => {
    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.activePlayerId = playerId

    mockDuelState.players = {
      [playerId]: {
        ...MockPlayer1,
      },
      [opponentId]: {
        ...MockPlayer2,
      },
    }

    const state = duelReducer(mockDuelState, endTurn())

    const { phase, turn, activePlayerId } = state

    expect(turn).toBe(mockDuelState.turn + 1)
    expect(phase).toBe('Player Turn')
    expect(activePlayerId).toBe(opponentId)
  })

  test('play card', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const cardId = novice.id
    const stacks = ['hand', 'discard', 'deck']

    stacks.forEach((stack: 'hand' | 'discard' | 'deck') => {
      mockDuelState.players = {
        [playerId]: {
          ...MockPlayer1,
          [stack]: [cardId],
          cards: {
            [cardId]: novice,
          },
        },
        [opponentId]: {
          ...MockPlayer2,
          hand: [],
          cards: {},
        },
      }

      const mockPlayingPlayer = mockDuelState.players[playerId]

      const state = duelReducer(
        mockDuelState,
        playCard({
          cardId: novice.id,
          playerId,
        }),
      )

      const playingPlayer = state.players[playerId]

      expect(playingPlayer[stack]).toHaveLength(0)
      expect(playingPlayer.board).toHaveLength(
        mockPlayingPlayer.board.length + 1,
      )
      expect(playingPlayer.board).toContain(cardId)
    })
  })

  test('update a card', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const cardId = novice.id

    mockDuelState.activePlayerId = playerId

    mockDuelState.players = {
      [playerId]: {
        ...MockPlayer1,
        board: [cardId],
        cards: {
          [cardId]: novice,
        },
      },
      [opponentId]: MockPlayer2,
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

  test('move a card from board to discard pile', () => {
    const novice = createPlayCardFromPrototype(HammeriteNovice)
    const guard = createPlayCardFromPrototype(TempleGuard)
    const cardId = novice.id
    const stacks = ['hand', 'board', 'deck']

    stacks.forEach((stack: 'hand' | 'board' | 'deck') => {
      mockDuelState.players = {
        [playerId]: {
          ...MockPlayer1,
          [stack]: [cardId, guard.id],
          discard: [],
          cards: {
            [cardId]: { ...novice, strength: 1 },
            [guard.id]: guard,
          },
        },
        [opponentId]: MockPlayer2,
      }

      const state = duelReducer(
        mockDuelState,
        moveCardToDiscard({
          playerId,
          cardId,
        }),
      )

      const player = state.players[playerId]

      expect(player[stack]).toHaveLength(1)
      expect(player.discard).toHaveLength(1)
      expect(player.discard).toContain(cardId)
      expect(player.cards[cardId].strength).toBe(
        player.cards[cardId].prototype.strength,
      )
    })
  })
})
