import {
  agentAttack,
  completeRedraw,
  DUEL_INITIAL_CARDS_DRAWN,
  duelReducer,
  DuelStartUsers,
  DuelState,
  endDuel,
  initialState,
  invalidFirstPlayerIdError,
  moveToNextAttackingAgent,
  moveToNextTurn,
  normalizePlayerCards,
  playCard,
  playersDrawInitialCards,
  resolveTurn,
  startDuel,
  startFirstPlayerTurn,
} from 'src/modules/duel'
import {
  initialDuelStateMock,
  opponentId,
  opponentMock,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/shared/__mocks__'
import { HammeriteNovice, Zombie } from 'src/shared/data'
import { deepClone } from 'src/shared/utils'

const users: DuelStartUsers = [userMock, opponentMock]
let state: DuelState

describe('Setup Duel', () => {
  beforeEach(() => {
    state = deepClone(initialState)
  })

  it('should initialize the duel with a preset first player', () => {
    const { phase, playerOrder, players } = duelReducer(
      state,
      startDuel({ users, firstPlayerId: playerId }),
    )

    expect(phase).toBe('Initial Draw')
    expect(playerOrder).toEqual([playerId, opponentId])
    expect(players).toHaveProperty(playerId)
    expect(players).toHaveProperty(opponentId)
  })

  it('should initialize the duel with a random first player', () => {
    const { phase, playerOrder } = duelReducer(state, startDuel({ users }))

    expect(phase).toBe('Initial Draw')
    expect(playerOrder).toContain(playerId)
    expect(playerOrder).toContain(opponentId)
  })

  it('should throw an error for an invalid first player id is passed', () => {
    expect(() =>
      duelReducer(state, startDuel({ users, firstPlayerId: 'invalid' })),
    ).toThrow(invalidFirstPlayerIdError)
  })

  it('should move initial cards from deck to hand and change phase to Redrawing', () => {
    const { phase, players } = duelReducer(
      initialDuelStateMock,
      playersDrawInitialCards(),
    )

    expect(phase).toBe('Redrawing')
    expect(players[playerId].hand.length).toBe(DUEL_INITIAL_CARDS_DRAWN)
    expect(players[opponentId].hand.length).toBe(DUEL_INITIAL_CARDS_DRAWN)
    expect(players[playerId].deck.length).toBe(
      initialDuelStateMock.players[playerId].deck.length -
        DUEL_INITIAL_CARDS_DRAWN,
    )
    expect(players[opponentId].deck.length).toBe(
      initialDuelStateMock.players[opponentId].deck.length -
        DUEL_INITIAL_CARDS_DRAWN,
    )
  })

  it('should mark the player as having performed an action after redraw', () => {
    const { players } = duelReducer(
      initialDuelStateMock,
      completeRedraw({ playerId }),
    )

    expect(players[playerId].hasPerformedAction).toBe(true)
  })

  it('should start the first player’s turn and draw a card', () => {
    const state = deepClone(initialDuelStateMock)
    state.players[playerId].hasPerformedAction = true
    state.players[opponentId].hasPerformedAction = true

    const { phase, players } = duelReducer(state, startFirstPlayerTurn())

    expect(phase).toBe('Player Turn')
    expect(players[playerId].hasPerformedAction).toBe(false)
    expect(players[opponentId].hasPerformedAction).toBe(false)
    expect(players[playerId].hand).toContain(
      initialDuelStateMock.players[playerId].deck[0],
    )
  })
})

describe('Player Turns', () => {
  beforeEach(() => {
    state = deepClone(stackedDuelStateMock)
  })

  it('should switch active player, handle income and reset actions when moving to the next turn', () => {
    state.players[playerId].hasPerformedAction = true
    state.players[opponentId].income = 1
    state.players[opponentId].coins = 2
    state.playerOrder = [playerId, opponentId]

    const { playerOrder, players } = duelReducer(state, moveToNextTurn())

    expect(playerOrder).toEqual([opponentId, playerId])
    expect(players[playerId].hasPerformedAction).toBe(false)
    expect(players[opponentId].hasPerformedAction).toBe(false)
    expect(players[opponentId].coins).toBe(3)
    expect(players[opponentId].income).toBe(0)
  })

  it("should reduce defending agent's strength", () => {
    const defendingAgentId = 'defender'
    state.players[playerId].cards = { attacker: { ...HammeriteNovice } }
    state.players[opponentId].cards = {
      [defendingAgentId]: { ...Zombie, strength: 2 },
    }

    const { players } = duelReducer(
      state,
      agentAttack({ defendingPlayerId: opponentId, defendingAgentId }),
    )

    if (players[opponentId].cards[defendingAgentId].type !== 'agent') return

    expect(players[opponentId].cards[defendingAgentId].strength).toBe(1)
  })

  it('should steal coins if no defending agent', () => {
    state.players[opponentId].coins = 5

    const { players } = duelReducer(
      state,
      agentAttack({ defendingPlayerId: opponentId }),
    )

    expect(players[opponentId].coins).toBe(4)
  })

  it('should move a card to the board and deduct coins if needed', () => {
    const cardId = 'card'
    state.players[playerId].coins = HammeriteNovice.cost + 1
    state.players[playerId].cards = { [cardId]: HammeriteNovice }

    const { players } = duelReducer(
      state,
      playCard({ cardId, playerId, shouldPay: true }),
    )

    expect(players[playerId].hasPerformedAction).toBe(true)
    expect(players[playerId].coins).toBe(1)
  })

  it('should queue attacks based on board state', () => {
    state.players[playerId] = {
      ...state.players[playerId],
      ...normalizePlayerCards({
        board: ['ElevatedAcolyte', 'HammeriteNovice'],
      }),
    }

    state.players[opponentId] = {
      ...state.players[opponentId],
      ...normalizePlayerCards({
        board: ['TempleGuard'],
      }),
    }

    const { phase, players, attackingQueue, attackingAgentId } = duelReducer(
      state,
      resolveTurn(),
    )

    expect(phase).toBe('Resolving turn')
    expect(attackingAgentId).toBe(players[playerId].board[0])
    expect(attackingQueue).toHaveLength(4)
    expect(attackingQueue).toEqual([
      {
        attackerId: players[playerId].board[0],
        defenderId: players[opponentId].board[0],
      },
      {
        attackerId: players[opponentId].board[0],
        defenderId: players[playerId].board[0],
      },
      {
        attackerId: players[playerId].board[1],
        defenderId: players[opponentId].board[0],
      },
      {
        attackerId: players[opponentId].board[0],
        defenderId: players[playerId].board[1],
      },
    ])
  })

  it('should set an empty attacking id if the active player board is empty', () => {
    state.players[playerId] = {
      ...state.players[playerId],
      ...normalizePlayerCards({
        board: [],
      }),
    }

    state.players[opponentId] = {
      ...state.players[opponentId],
      ...normalizePlayerCards({
        board: [],
      }),
    }

    const { attackingQueue, attackingAgentId } = duelReducer(
      state,
      resolveTurn(),
    )

    expect(attackingQueue).toEqual([])
    expect(attackingAgentId).toBe('')
  })

  it('should move to the next attacking agent in the queue', () => {
    state.attackingQueue = [
      { attackerId: 'agent1', defenderId: 'target1' },
      { attackerId: 'agent2', defenderId: 'target2' },
    ]
    state.attackingAgentId = 'agent1'

    const newState = duelReducer(state, moveToNextAttackingAgent())

    expect(newState.attackingAgentId).toBe('agent2')
    expect(newState.attackingQueue).toHaveLength(1)
    expect(newState.attackingQueue[0].attackerId).toBe('agent2')
  })

  it('should clear attacking agent when queue is empty', () => {
    state.attackingQueue = [{ attackerId: 'agent1', defenderId: 'target1' }]
    state.attackingAgentId = 'agent1'

    const newState = duelReducer(state, moveToNextAttackingAgent())

    expect(newState.attackingAgentId).toBe('')
    expect(newState.attackingQueue).toHaveLength(0)
  })

  it('should correctly set the victorious player', () => {
    const { phase, victoriousPlayerId } = duelReducer(state, endDuel(playerId))

    expect(phase).toBe('Duel End')
    expect(victoriousPlayerId).toBe(playerId)
  })
})
