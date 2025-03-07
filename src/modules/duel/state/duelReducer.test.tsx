import {
  initialDuelStateMock,
  opponentId,
  opponentMock,
  playerId,
  stackedDuelStateMock,
  userMock,
} from 'src/__mocks__/DuelMocks'
import {
  INITIAL_CARDS_DRAWN_IN_DUEL,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/DuelConstants'
import { duelReducer, initialState } from 'src/modules/duel/state/duelReducer'
import {
  AttackOrder,
  DuelAction,
  DuelPhase,
  DuelState,
  UsersStartingDuel,
} from 'src/modules/duel/DuelTypes'
import { Agent } from 'src/shared/modules/cards/CardTypes'

describe('Setup', () => {
  const users: UsersStartingDuel = [userMock, opponentMock]

  it('should start a duel with a random first player when START_DUEL action is dispatched without firstPlayerIndex', () => {
    const action: DuelAction = {
      type: 'START_DUEL',
      users,
    }

    const { players } = duelReducer(initialState, action)

    Object.keys(players).forEach((playerId) => {
      const { name, deck } = players[playerId]

      expect(players[playerId]).toMatchObject({
        name,
        coins: STARTING_COINS_IN_DUEL,
        income: 0,
        hand: [],
        board: [],
        discard: [],
        hasPerformedAction: false,
      })

      expect(deck).toHaveLength(
        users.find(({ id }) => id === playerId)?.deck.length || 0,
      )
    })
  })

  it('should start a duel with a fixed first player when START_DUEL action is dispatched with firstPlayerIndex', () => {
    const action: DuelAction = {
      type: 'START_DUEL',
      users,
      firstPlayerIndex: 1,
    }

    const { playerOrder } = duelReducer(initialState, action)

    expect(playerOrder).toEqual([opponentMock.id, userMock.id])
  })

  it('should draw initial cards when DRAW_INITIAL_CARDS action is dispatched', () => {
    const action: DuelAction = {
      type: 'DRAW_INITIAL_CARDS',
    }

    const { players } = duelReducer(initialDuelStateMock, action)

    Object.keys(players).forEach((playerId) => {
      const { hand } = players[playerId]

      expect(hand).toHaveLength(INITIAL_CARDS_DRAWN_IN_DUEL)
    })
  })
})

describe('Redraw', () => {
  it('should set player hasPerformedAction to true when SKIP_REDRAW action is dispatched', () => {
    const action: DuelAction = {
      type: 'SKIP_REDRAW',
      playerId,
    }

    const {
      players: { [playerId]: player, [opponentId]: opponent },
    } = duelReducer(initialDuelStateMock, action)

    expect(player.hasPerformedAction).toBe(true)
    expect(opponent.hasPerformedAction).toBe(false)
  })

  it('should put back a card from hand and draw top card from deck when REDRAW_CARD action is dispatched', () => {
    const { hand: mockPlayerHand, deck: mockPlayerDeck } =
      stackedDuelStateMock.players[playerId]

    const action: DuelAction = {
      type: 'REDRAW_CARD',
      playerId,
      cardId: mockPlayerHand[0],
    }

    const {
      players: { [playerId]: player, [opponentId]: opponent },
    } = duelReducer(stackedDuelStateMock, action)

    expect(player.deck).toContain(mockPlayerHand[0])
    expect(player.hand).toContain(mockPlayerDeck[0])
    expect(player.hasPerformedAction).toBe(true)
    expect(opponent.hasPerformedAction).toBe(false)
  })

  it('should reset players hasPerformedAction advance to player turn phase and draw a card for the active player when COMPLETE_REDRAW action is dispatched', () => {
    const action: DuelAction = {
      type: 'COMPLETE_REDRAW',
    }

    const {
      players: { [playerId]: player, [opponentId]: opponent },
      playerOrder: [activePlayerId],
      phase,
    } = duelReducer(initialDuelStateMock, action)

    expect(phase).toBe('Player Turn')
    expect(player.hasPerformedAction).toBe(false)
    expect(player.hand).toHaveLength(
      initialDuelStateMock.players[activePlayerId].hand.length + 1,
    )
    expect(opponent.hasPerformedAction).toBe(false)
  })
})

describe('Player Turns', () => {
  it("should move to the next player's turn and reset attack queue when ADVANCE_TURN action is dispatched", () => {
    const action: DuelAction = {
      type: 'ADVANCE_TURN',
    }

    const {
      players: { [playerId]: player, [opponentId]: opponent },
      playerOrder: [activePlayerId],
      attackingQueue,
      phase,
    } = duelReducer(stackedDuelStateMock, action)

    expect(phase).toBe('Player Turn')
    expect(attackingQueue).toEqual(initialState.attackingQueue)
    expect(player.hasPerformedAction).toBe(false)
    expect(opponent.hand).toHaveLength(
      stackedDuelStateMock.players[activePlayerId].hand.length + 1,
    )
    expect(opponent.hasPerformedAction).toBe(false)
  })

  it('should handle income when ADVANCE_TURN action is dispatched', () => {
    const action: DuelAction = {
      type: 'ADVANCE_TURN',
    }

    const mockState: DuelState = stackedDuelStateMock
    mockState.players[opponentId].income = 2

    const {
      players: { [opponentId]: opponent },
    } = duelReducer(mockState, action)

    expect(opponent.coins).toBe(mockState.players[opponentId].coins + 1)
    expect(opponent.income).toBe(mockState.players[opponentId].income - 1)
  })

  it('should calculateAttackQueue when RESOLVE_TURN action is dispatched', () => {
    const action: DuelAction = {
      type: 'RESOLVE_TURN',
    }

    const {
      attackingQueue,
      phase,
      playerOrder: [activePlayerId, inactivePlayerId],
      players: {
        [activePlayerId]: activePlayer,
        [inactivePlayerId]: inactivePlayer,
      },
    } = duelReducer(stackedDuelStateMock, action)

    expect(phase).toBe('Resolving turn' as DuelPhase)
    expect(attackingQueue).toEqual([
      {
        attackerId: activePlayer.board[0],
        defenderId: inactivePlayer.board[0],
        attackingPlayerId: activePlayerId,
        defendingPlayerId: inactivePlayerId,
      },
    ] as AttackOrder[])
  })

  it('should attack the defending agent if AGENT_ATTACK action is dispatched', () => {
    const defendingAgentId = stackedDuelStateMock.players[opponentId].board[0]
    stackedDuelStateMock.attackingQueue = [
      {
        attackerId: stackedDuelStateMock.players[playerId].board[0],
        attackingPlayerId: playerId,
        defenderId: defendingAgentId,
        defendingPlayerId: opponentId,
      },
    ]

    const action: DuelAction = {
      type: 'AGENT_ATTACK',
      defendingPlayerId: opponentId,
      defendingAgentId,
    }

    const {
      players: { [opponentId]: opponent },
    } = duelReducer(stackedDuelStateMock, action)

    const mockCard =
      stackedDuelStateMock.players[opponentId].cards[defendingAgentId]

    expect((opponent.cards[opponent.board[0]] as Agent).strength).toBe(
      (mockCard as Agent).strength - 1,
    )
  })

  it('should attack the defending player if AGENT_ATTACK action is dispatched and there is no defending agent', () => {
    const action: DuelAction = {
      type: 'AGENT_ATTACK',
      defendingPlayerId: opponentId,
    }
    stackedDuelStateMock.attackingQueue = [
      {
        attackerId: stackedDuelStateMock.players[playerId].board[0],
        attackingPlayerId: playerId,
        defenderId: '',
        defendingPlayerId: opponentId,
      },
    ]

    const {
      players: { [opponentId]: opponent },
    } = duelReducer(stackedDuelStateMock, action)

    expect(opponent.coins).toBe(
      stackedDuelStateMock.players[opponentId].coins - 1,
    )
  })

  it('should move to the next attacker if MOVE_TO_NEXT_ATTACKER action is dispatched', () => {
    const action: DuelAction = {
      type: 'MOVE_TO_NEXT_ATTACKER',
    }

    const mockState: DuelState = stackedDuelStateMock
    mockState.attackingQueue = [
      {
        attackerId: '1',
        attackingPlayerId: '4',
        defenderId: '2',
        defendingPlayerId: '3',
      },
    ]

    const { attackingQueue } = duelReducer(mockState, action)

    expect(attackingQueue).toEqual([])
  })

  it('should play and pay cost of played card when PLAY_CARD action is dispatched', () => {
    const playedCardId = stackedDuelStateMock.players[playerId].hand[0]

    const action: DuelAction = {
      type: 'PLAY_CARD',
      cardId: playedCardId,
      playerId,
      shouldPay: true,
    }

    const {
      players: { [playerId]: player },
    } = duelReducer(stackedDuelStateMock, action)

    expect(player.board).toContain(playedCardId)
    expect(player.hand).not.toContain(playedCardId)
    expect(player.coins).toBe(
      stackedDuelStateMock.players[playerId].coins -
        player.cards[playedCardId].cost,
    )
  })

  it('should discard a card when DISCARD_CARD action is dispatched', () => {
    const discardedCardId = stackedDuelStateMock.players[playerId].board[0]

    const action: DuelAction = {
      type: 'DISCARD_CARD',
      cardId: discardedCardId,
      playerId,
    }

    const {
      players: { [playerId]: player },
    } = duelReducer(stackedDuelStateMock, action)

    expect(player.board).not.toContain(discardedCardId)
    expect(player.discard).toContain(discardedCardId)
  })

  it('should update an agent when UPDATE_AGENT action is dispatched', () => {
    const updatedCardId = stackedDuelStateMock.players[playerId].board[0]
    const update: Partial<Agent> = {
      strength: 1,
      cost: 1,
    }

    const action: DuelAction = {
      type: 'UPDATE_AGENT',
      cardId: updatedCardId,
      playerId,
      update,
    }

    const {
      players: { [playerId]: player },
    } = duelReducer(stackedDuelStateMock, action)

    expect(player.cards[updatedCardId]).toMatchObject(update)
  })
})

describe('General', () => {
  it('should return current state for unknown actions', () => {
    const action = { type: 'UNKNOWN_ACTION' } as unknown as DuelAction

    const previousState: DuelState = {
      ...initialState,
      phase: 'Resolving turn',
    }
    const newState = duelReducer(previousState, action)

    expect(newState).toBe(previousState)
  })

  it('should be able to add a message to the logs', () => {
    const opponent = stackedDuelStateMock.players[opponentId]
    const message: React.ReactNode = (
      <p>
        {opponent.name} has played {opponent.cards[opponent.hand[0]].name}.
      </p>
    )
    const action: DuelAction = {
      type: 'ADD_LOG',
      message,
    }

    const { logs } = duelReducer(initialDuelStateMock, action)
    expect(logs).toContain(message)
  })
})
