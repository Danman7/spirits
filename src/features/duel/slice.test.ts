import { DuelState, PlayerCards } from 'src/features/duel/types'
import { MockPlayer1, MockPlayer2 } from 'src/features/duel/__mocks__'
import { normalizeArrayOfPlayers } from 'src/features/duel/utils'
import duelReducer, {
  drawCardFromDeck,
  initializeEndTurn,
  initializeDuel,
  initialState,
  playCard,
  beginPlay,
  startRedraw,
  updateAgent,
  putCardAtBottomOfDeck,
  moveCardToDiscard,
  moveCardToBoard,
  moveToNextAttacker,
  addNewCards,
} from 'src/features/duel/slice'

import {
  HammeriteNovice,
  TempleGuard,
  Zombie,
} from 'src/features/cards/CardPrototypes'
import { createDuelCard } from 'src/features/cards/utils'
import { DuelAgent, DuelCard } from 'src/features/cards/types'

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
    mockDuelState = {
      ...initialState,
      players: normalizedPlayers,
      playerOrder: [opponentId, playerId],
    }

    const state = duelReducer(mockDuelState, startRedraw())

    expect(state.phase).toBe('Redrawing Phase')
  })

  test('put a card at the bottom of the deck', () => {
    mockDuelState.phase = 'Redrawing Phase'

    const novice = createDuelCard(HammeriteNovice)
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
    mockDuelState.players = {
      [playerId]: MockPlayer1,
      [opponentId]: MockPlayer2,
    }
    mockDuelState.playerOrder = [opponentId, playerId]

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

    expect(phase).toBe('Player Turn')
    expect(attackingAgentId).toBe('')
  })

  test('initialize end of turn resolution if active player has units on board', () => {
    const novice = createDuelCard(HammeriteNovice)

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
    const novice = createDuelCard(HammeriteNovice)

    mockDuelState.phase = 'Player Turn'
    mockDuelState.players = {
      [playerId]: {
        ...mockDuelState.players[playerId],
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        board: [novice.id],
      },
      [opponentId]: { ...mockDuelState.players[opponentId], board: [] },
    }

    const state = duelReducer(mockDuelState, initializeEndTurn())

    const { players } = state

    expect(players[opponentId].coins).toBe(MockPlayer2.coins - 1)
  })

  test('agent attacking agent', () => {
    const novice = createDuelCard(HammeriteNovice)
    const zombie = createDuelCard(Zombie)

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

    const state = duelReducer(mockDuelState, initializeEndTurn())

    const { players } = state

    const damagedAgent = players[opponentId].cards[zombie.id] as DuelAgent

    expect(damagedAgent.strength).toBe(Zombie.strength - 1)
  })

  test('end of turn as player', () => {
    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.activePlayerId = playerId

    const coins = 20
    const income = 2

    mockDuelState.players = {
      [playerId]: {
        ...MockPlayer1,
        income,
        coins,
      },
      [opponentId]: MockPlayer2,
    }

    const state = duelReducer(mockDuelState, moveToNextAttacker())

    const { phase, turn, activePlayerId, players } = state

    const player = players[playerId]

    expect(turn).toBe(mockDuelState.turn + 1)
    expect(phase).toBe('Player Turn')
    expect(activePlayerId).toBe(opponentId)
    expect(player.coins).toBe(coins + 1)
    expect(player.income).toBe(income - 1)
  })

  test('agent attacking agent on opposite slot', () => {
    const novice1 = createDuelCard(HammeriteNovice)
    const novice2 = createDuelCard(HammeriteNovice)
    const zombie1 = createDuelCard(Zombie)
    const zombie2 = createDuelCard(Zombie)

    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.activePlayerId = opponentId
    mockDuelState.players = {
      [playerId]: {
        ...MockPlayer1,
        cards: {
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        deck: [],
        hand: [],
        board: [zombie1.id, zombie2.id],
      },
      [opponentId]: {
        ...MockPlayer2,
        cards: {
          [novice1.id]: novice1,
          [novice2.id]: novice2,
        },
        deck: [],
        hand: [],
        board: [novice1.id, novice2.id],
      },
    }

    const mockDefendingCard = mockDuelState.players[playerId].cards[
      mockDuelState.players[playerId].board[0]
    ] as DuelAgent

    const state = duelReducer(mockDuelState, moveToNextAttacker())

    const { players, attackingAgentId } = state

    const player = players[playerId]
    const opponent = players[opponentId]

    const defendingCard = player.cards[player.board[0]] as DuelAgent

    expect(attackingAgentId).toBe(opponent.board[0])
    expect(defendingCard.strength).toBe(mockDefendingCard.strength - 1)
  })

  test('agent attacking agent on previous slot', () => {
    const novice = createDuelCard(HammeriteNovice)
    const zombie1 = createDuelCard(Zombie)
    const zombie2 = createDuelCard(Zombie)

    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.activePlayerId = playerId
    mockDuelState.attackingAgentId = zombie1.id
    mockDuelState.players = {
      [playerId]: {
        ...MockPlayer1,
        cards: {
          [zombie1.id]: zombie1,
          [zombie2.id]: zombie2,
        },
        deck: [],
        hand: [],
        board: [zombie1.id, zombie2.id],
      },
      [opponentId]: {
        ...MockPlayer2,
        cards: {
          [novice.id]: novice,
        },
        deck: [],
        hand: [],
        board: [novice.id],
      },
    }

    const mockDefendingCard = mockDuelState.players[opponentId].cards[
      mockDuelState.players[opponentId].board[0]
    ] as DuelAgent

    const state = duelReducer(mockDuelState, moveToNextAttacker())

    const { players, attackingAgentId } = state

    const player = players[playerId]
    const opponent = players[opponentId]

    const defendingCard = opponent.cards[opponent.board[0]] as DuelAgent

    expect(attackingAgentId).toBe(player.board[1])
    expect(defendingCard.strength).toBe(mockDefendingCard.strength - 1)
  })

  test('end turn when there are no attackers', () => {
    mockDuelState.phase = 'Resolving end of turn'
    mockDuelState.activePlayerId = opponentId

    const state = duelReducer(mockDuelState, moveToNextAttacker())

    const { phase, turn, activePlayerId } = state

    expect(turn).toBe(mockDuelState.turn + 1)
    expect(phase).toBe('Player Turn')
    expect(activePlayerId).toBe(playerId)
  })

  test('play card', () => {
    const novice = createDuelCard(HammeriteNovice)
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

      expect(playingPlayer.coins).toBe(mockPlayingPlayer.coins - novice.cost)
      expect(playingPlayer[stack]).toHaveLength(0)
      expect(playingPlayer.board).toHaveLength(
        mockPlayingPlayer.board.length + 1,
      )
      expect(playingPlayer.board).toContain(cardId)
    })
  })

  test('move card to board without playing it', () => {
    const novice = createDuelCard(HammeriteNovice)
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
        moveCardToBoard({
          cardId: novice.id,
          playerId,
        }),
      )

      const playingPlayer = state.players[playerId]

      expect(playingPlayer.coins).toBe(mockPlayingPlayer.coins)
      expect(playingPlayer[stack]).toHaveLength(0)
      expect(playingPlayer.board).toHaveLength(
        mockPlayingPlayer.board.length + 1,
      )
      expect(playingPlayer.board).toContain(cardId)
    })
  })

  test('update an agent', () => {
    const novice = createDuelCard(HammeriteNovice)
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

    const update: Partial<DuelCard> = {
      cost: 1,
      strength: 5,
    }

    const state = duelReducer(
      mockDuelState,
      updateAgent({
        playerId,
        cardId,
        update,
      }),
    )

    const updatedCard = state.players[playerId].cards[cardId] as DuelAgent

    expect(updatedCard.strength).toBe(update.strength)
    expect(updatedCard.cost).toBe(update.cost)
  })

  test('remove agent with no strength as a result of update', () => {
    const novice = createDuelCard(HammeriteNovice)
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

    const update: Partial<DuelCard> = {
      strength: 0,
    }

    const state = duelReducer(
      mockDuelState,
      updateAgent({
        playerId,
        cardId,
        update,
      }),
    )

    const player = state.players[playerId]

    expect(player.board).toHaveLength(0)
    expect(player.discard).toContain(cardId)
  })

  test('move a card from board to discard pile', () => {
    const novice = createDuelCard(HammeriteNovice)
    const guard = createDuelCard(TempleGuard)
    const cardId = novice.id
    const stacks = ['hand', 'board', 'deck']

    stacks.forEach((stack: 'hand' | 'board' | 'deck') => {
      mockDuelState.players = {
        [playerId]: {
          ...MockPlayer1,
          [stack]: [cardId, guard.id],
          discard: [],
          cards: {
            [cardId]: { ...novice, strength: 1 } as DuelAgent,
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

      const discardedCard = player.cards[cardId] as DuelAgent

      expect(player[stack]).toHaveLength(1)
      expect(player.discard).toHaveLength(1)
      expect(player.discard).toContain(cardId)
      expect(discardedCard.strength).toBe(discardedCard.prototype.strength)
      expect(player.income).toBe(novice.cost)
    })
  })
})

test('summon new cards for a player', () => {
  const novice = createDuelCard(HammeriteNovice)

  mockDuelState.activePlayerId = playerId

  mockDuelState.players = {
    [playerId]: {
      ...MockPlayer1,
      deck: [],
      cards: {},
    },
    [opponentId]: MockPlayer2,
  }

  const addedCards: PlayerCards = {
    [novice.id]: novice,
  }

  const state = duelReducer(
    mockDuelState,
    addNewCards({
      playerId,
      cards: addedCards,
    }),
  )

  const player = state.players[playerId]

  expect(player.cards).toEqual(addedCards)
})
