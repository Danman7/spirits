import {
  agentAttack,
  CardStack,
  completeRedraw,
  discardCard,
  drawACardFromDeck,
  DUEL_INCOME_PER_TURN,
  DUEL_INITIAL_CARDS_DRAWN,
  duelReducer,
  DuelStartUsers,
  DuelState,
  initialState,
  invalidFirstPlayerIdError,
  moveToNextAttackingAgent,
  moveToNextTurn,
  normalizePlayerCards,
  playCard,
  playersDrawInitialCards,
  putACardAtBottomOfDeck,
  resolveTurn,
  startDuel,
  startFirstPlayerTurn,
  updateAgent,
} from 'src/modules/duel'
import {
  initialDuelStateMock,
  initialPlayerMock,
  opponentId,
  opponentMock,
  playerId,
  stackedDuelStateMock,
  stackedOpponentMock,
  stackedPlayerMock,
  userMock,
} from 'src/shared/__mocks__'
import { HammeriteNovice } from 'src/shared/data'
import { Agent, Card } from 'src/shared/types'
import { deepClone } from 'src/shared/utils'

const users: DuelStartUsers = [userMock, opponentMock]

let mockDuelState: DuelState

describe('Starting a duel', () => {
  beforeEach(() => {
    mockDuelState = deepClone(initialState)
  })

  test('start a new duel with a random first player', () => {
    const state = duelReducer(
      mockDuelState,
      startDuel({
        users,
      }),
    )

    const { phase, players } = state
    const player = players[playerId]
    const opponent = players[opponentId]

    expect(phase).toBe('Initial Draw')
    expect(player.name).toEqual(userMock.name)
    expect(player.deck).toHaveLength(userMock.deck.length)
    expect(opponent.name).toEqual(opponentMock.name)
    expect(opponent.deck).toHaveLength(opponentMock.deck.length)
  })

  test('start a new duel with a preset first player', () => {
    const firstPlayerId = opponentId
    const state = duelReducer(
      mockDuelState,
      startDuel({
        users,
        firstPlayerId,
      }),
    )
    const { playerOrder, phase } = state

    expect(playerOrder[0]).toEqual(firstPlayerId)
    expect(phase).toBe('Initial Draw')
  })

  test('throw an error when initializing game if firstPlayerId is set to a non existent player', () => {
    expect(() => {
      duelReducer(
        mockDuelState,
        startDuel({
          users,
          firstPlayerId: 'random-id',
        }),
      )
    }).toThrow(invalidFirstPlayerIdError)
  })
})

describe('Sequence before play', () => {
  beforeEach(() => {
    mockDuelState = deepClone(initialDuelStateMock)
  })

  test("draw a card from a player's deck if it has cards", () => {
    const state = duelReducer(mockDuelState, drawACardFromDeck({ playerId }))
    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(initialPlayerMock.deck.length - 1)
    expect(drawingPlayer.hand).toHaveLength(initialPlayerMock.hand.length + 1)
    expect(drawingPlayer.hand).toContain(initialPlayerMock.deck[0])
  })

  test('should draw no card if deck has no cards', () => {
    mockDuelState.players[playerId] = {
      ...initialPlayerMock,
      hand: [],
      deck: [],
    }

    const state = duelReducer(mockDuelState, drawACardFromDeck({ playerId }))
    const drawingPlayer = state.players[playerId]

    expect(drawingPlayer.deck).toHaveLength(0)
    expect(drawingPlayer.hand).toHaveLength(0)
  })

  test('initial card draw', () => {
    const state = duelReducer(mockDuelState, playersDrawInitialCards())
    const { players } = state

    Object.values(players).forEach(({ hand, deck, id }) => {
      expect(hand).toHaveLength(DUEL_INITIAL_CARDS_DRAWN)
      expect(deck).toHaveLength(
        mockDuelState.players[id].deck.length - DUEL_INITIAL_CARDS_DRAWN,
      )
    })
    expect(state.phase).toBe('Redrawing')
  })

  test('put a card at the bottom of the deck', () => {
    const stacks = ['hand', 'board', 'discard']

    stacks.forEach((stack: 'hand' | 'board' | 'discard') => {
      const normalizedCards = normalizePlayerCards({
        [stack]: ['HammeriteNovice'],
      })

      mockDuelState.players[playerId] = {
        ...initialPlayerMock,
        ...normalizedCards,
      }

      const cardId = normalizedCards[stack]?.[0] as string
      const state = duelReducer(
        mockDuelState,
        putACardAtBottomOfDeck({
          playerId,
          cardId,
        }),
      )
      const player = state.players[playerId]

      expect(player[stack]).toHaveLength(0)
      expect(player.deck).toHaveLength(normalizedCards.deck.length + 1)
      expect(player.deck).toContain(cardId)
    })
  })

  test('mark that a player has completed redraw', () => {
    const state = duelReducer(mockDuelState, completeRedraw({ playerId }))
    const { players } = state

    expect(players[playerId].hasPerformedAction).toBeTruthy()
    expect(players[opponentId].hasPerformedAction).toBeFalsy()
  })
})

describe('Playing turns', () => {
  beforeEach(() => {
    mockDuelState = deepClone(stackedDuelStateMock)
  })

  test('begin player turn after redrawing is completed without switching active player', () => {
    mockDuelState.phase = 'Redrawing'
    Object.keys(mockDuelState.players).forEach((id) => {
      mockDuelState.players[id] = {
        ...mockDuelState.players[id],
        hasPerformedAction: true,
      }
    })

    const state = duelReducer(mockDuelState, startFirstPlayerTurn())
    const { phase, players, playerOrder } = state

    expect(phase).toBe('Player Turn')
    expect(players[playerOrder[0]].hand).toHaveLength(
      stackedPlayerMock.hand.length + 1,
    )
    expect(
      Object.values(players).every(
        ({ hasPerformedAction }) => !hasPerformedAction,
      ),
    ).toBeTruthy()
    expect(playerOrder[0]).toBe(playerId)
  })

  test('advance turn, reset attackingAgentId, draw card and resolve income', () => {
    const coins = 20
    const income = 2

    mockDuelState.players[opponentId].coins = coins
    mockDuelState.players[opponentId].income = income
    mockDuelState.attackingAgentId = mockDuelState.players[playerId].board[0]
    mockDuelState.phase = 'Resolving turn'

    const state = duelReducer(mockDuelState, moveToNextTurn())
    const { players, attackingAgentId, playerOrder } = state
    const opponent = players[opponentId]

    expect(attackingAgentId).toBe(initialState.attackingAgentId)
    expect(playerOrder[0]).toBe(opponentId)
    expect(opponent.coins).toBe(coins + DUEL_INCOME_PER_TURN)
    expect(opponent.income).toBe(income - DUEL_INCOME_PER_TURN)
    expect(opponent.hand).toHaveLength(stackedOpponentMock.hand.length + 1)
    expect(opponent.deck).toHaveLength(stackedOpponentMock.deck.length - 1)
  })

  test('resolve end of turn', () => {
    const state = duelReducer(mockDuelState, resolveTurn())
    const { phase, attackingAgentId, attackingQueue, players } = state
    const player = players[playerId]
    const opponent = players[opponentId]

    expect(phase).toBe('Resolving turn')
    expect(attackingAgentId).toBe(stackedPlayerMock.board?.[0])
    expect(attackingQueue).toEqual([
      { attackerId: player.board[0], defenderId: opponent.board[0] },
    ])
  })

  test('resolve end of turn if active player has more agents on board', () => {
    mockDuelState.players[playerId] = {
      ...stackedPlayerMock,
      ...normalizePlayerCards({
        board: ['TempleGuard', 'TempleGuard'],
      }),
    }

    const state = duelReducer(mockDuelState, resolveTurn())
    const { phase, attackingAgentId, attackingQueue, players } = state
    const player = players[playerId]
    const opponent = players[opponentId]

    expect(phase).toBe('Resolving turn')
    expect(attackingAgentId).toBe(player.board?.[0])
    expect(attackingQueue).toEqual([
      { attackerId: player.board[0], defenderId: opponent.board[0] },
      { attackerId: player.board[1], defenderId: opponent.board[0] },
    ])
  })

  test('resolve end of turn if active player has no agents on board', () => {
    mockDuelState.players[playerId].board = []

    const state = duelReducer(mockDuelState, resolveTurn())
    const { phase, attackingAgentId, attackingQueue } = state

    expect(phase).toBe('Resolving turn')
    expect(attackingAgentId).toBe('')
    expect(attackingQueue).toEqual([])
  })

  test('agent attacking player', () => {
    mockDuelState.attackingAgentId = stackedPlayerMock.board[0]
    mockDuelState.players[opponentId].board = []

    const state = duelReducer(
      mockDuelState,
      agentAttack({
        defendingAgentId: '',
        defendingPlayerId: opponentId,
      }),
    )
    const { players } = state

    expect(players[opponentId].coins).toBe(stackedOpponentMock.coins - 1)
  })

  test('agent attacking agent', () => {
    mockDuelState.attackingAgentId = stackedPlayerMock.board[0]

    const state = duelReducer(
      mockDuelState,
      agentAttack({
        defendingAgentId: stackedOpponentMock.board[0],
        defendingPlayerId: opponentId,
      }),
    )
    const { players } = state
    const referenceAgent = stackedOpponentMock.cards[
      stackedOpponentMock.board[0]
    ] as Agent
    const damagedAgent = players[opponentId].cards[
      stackedOpponentMock.board[0]
    ] as Agent

    expect(damagedAgent.strength).toBe(referenceAgent.strength - 1)
  })

  test('move to next attacking agent', () => {
    mockDuelState.players[playerId] = {
      ...stackedPlayerMock,
      ...normalizePlayerCards({
        board: ['TempleGuard', 'TempleGuard'],
      }),
    }
    mockDuelState.attackingAgentId = mockDuelState.players[playerId].board[0]

    const player = mockDuelState.players[playerId]
    const opponent = mockDuelState.players[opponentId]

    mockDuelState.attackingQueue = [
      {
        attackerId: mockDuelState.attackingAgentId,
        defenderId: opponent.board[0],
      },
      {
        attackerId: player.board[1],
        defenderId: opponent.board[0],
      },
    ]

    const state = duelReducer(mockDuelState, moveToNextAttackingAgent())
    const { attackingAgentId } = state

    expect(attackingAgentId).toBe(mockDuelState.players[playerId].board[1])
  })

  test('reset attacking agent id if there is no suitable attacker', () => {
    mockDuelState.attackingAgentId = mockDuelState.players[playerId].board[0]
    const state = duelReducer(mockDuelState, moveToNextAttackingAgent())
    const { attackingAgentId } = state

    expect(attackingAgentId).toBe(initialState.attackingAgentId)
  })

  test('play card', () => {
    const stacks: CardStack[] = ['hand', 'discard', 'deck']

    stacks.forEach((stack: 'hand' | 'discard' | 'deck') => {
      const normalizedCards = normalizePlayerCards({
        [stack]: ['HammeriteNovice'],
      })

      mockDuelState.players[playerId] = {
        ...stackedPlayerMock,
        ...normalizedCards,
      }

      const cardId = normalizedCards[stack]?.[0] as string
      const mockPlayingPlayer = mockDuelState.players[playerId]
      const state = duelReducer(
        mockDuelState,
        playCard({
          cardId,
          playerId,
          shouldPay: true,
        }),
      )
      const playingPlayer = state.players[playerId]

      expect(playingPlayer.coins).toBe(
        mockPlayingPlayer.coins - HammeriteNovice.cost,
      )
      expect(playingPlayer[stack]).toHaveLength(0)
      expect(playingPlayer.board).toHaveLength(
        mockPlayingPlayer.board.length + 1,
      )
      expect(playingPlayer.board).toContain(cardId)
    })
  })

  test('move card to board without playing it', () => {
    const stacks: CardStack[] = ['hand', 'discard', 'deck']

    stacks.forEach((stack: 'hand' | 'discard' | 'deck') => {
      const normalizedCards = normalizePlayerCards({
        [stack]: ['HammeriteNovice'],
      })

      mockDuelState.players[playerId] = {
        ...stackedPlayerMock,
        ...normalizedCards,
      }

      const cardId = normalizedCards[stack]?.[0] as string
      const mockPlayingPlayer = mockDuelState.players[playerId]
      const state = duelReducer(
        mockDuelState,
        playCard({
          cardId,
          playerId,
          shouldPay: false,
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

  test('move a card from board to discard pile, reset its stats and add income', () => {
    const stacks: CardStack[] = ['hand', 'board', 'deck']

    stacks.forEach((stack: 'hand' | 'board' | 'deck') => {
      const normalizedCards = normalizePlayerCards({
        [stack]: ['HammeriteNovice', 'TempleGuard'],
      })

      mockDuelState.players[playerId] = {
        ...stackedPlayerMock,
        ...normalizedCards,
      }

      const cardId = normalizedCards[stack]?.[0] as string
      const state = duelReducer(
        mockDuelState,
        discardCard({
          playerId,
          cardId,
        }),
      )
      const player = state.players[playerId]
      const discardedCard = player.cards[cardId] as Agent

      expect(player[stack]).toHaveLength(1)
      expect(player.discard).toHaveLength(1)
      expect(player.discard).toContain(cardId)
      expect(player.income).toBe(discardedCard.cost + stackedPlayerMock.income)
      expect(discardedCard.strength).toBe(discardedCard.strength)
    })
  })

  test('update a card', () => {
    const cardId = mockDuelState.players[playerId].board[0]
    const update: Partial<Card> = {
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
    const updatedCard = state.players[playerId].cards[cardId] as Agent

    expect(updatedCard.strength).toBe(update.strength)
    expect(updatedCard.cost).toBe(update.cost)
  })
})
