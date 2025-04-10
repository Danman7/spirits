import {
  initialDuelStateMock,
  opponentId,
  playerId,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import type {
  AttackOrder,
  DuelAction,
  DuelPhase,
  DuelState,
} from 'src/modules/duel/state'
import { duelReducer, initialState } from 'src/modules/duel/state'

import type { Agent } from 'src/shared/modules/cards'

it("should move to the next player's turn and reset attack queue when ADVANCE_TURN action is dispatched", () => {
  const action: DuelAction = { type: 'ADVANCE_TURN' }

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
  const action: DuelAction = { type: 'ADVANCE_TURN' }

  const mockState: DuelState = stackedDuelStateMock
  mockState.players[opponentId].income = 2

  const {
    players: { [opponentId]: opponent },
  } = duelReducer(mockState, action)

  expect(opponent.coins).toBe(mockState.players[opponentId].coins + 1)
  expect(opponent.income).toBe(mockState.players[opponentId].income - 1)
})

it('should calculateAttackQueue when RESOLVE_TURN action is dispatched', () => {
  const action: DuelAction = { type: 'RESOLVE_TURN' }

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
    cards,
  } = duelReducer(stackedDuelStateMock, action)

  const mockCard = stackedDuelStateMock.cards[defendingAgentId]

  expect((cards[opponent.board[0]] as Agent).strength).toBe(
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
  const action: DuelAction = { type: 'MOVE_TO_NEXT_ATTACKER' }

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
    cards,
  } = duelReducer(stackedDuelStateMock, action)

  expect(player.board).toContain(playedCardId)
  expect(player.hand).not.toContain(playedCardId)
  expect(player.coins).toBe(
    stackedDuelStateMock.players[playerId].coins - cards[playedCardId].cost,
  )
})

it('should discard a card when DISCARD_CARD action is dispatched', () => {
  const discardedCardId = stackedDuelStateMock.players[playerId].board[0]

  const action: DuelAction = { type: 'DISCARD_CARD', cardId: discardedCardId }

  const {
    players: { [playerId]: player },
  } = duelReducer(stackedDuelStateMock, action)

  expect(player.board).not.toContain(discardedCardId)
  expect(player.discard).toContain(discardedCardId)
})

it('should update an agent when UPDATE_AGENT action is dispatched', () => {
  const updatedCardId = stackedDuelStateMock.players[playerId].board[0]
  const update: Partial<Agent> = { strength: 1, cost: 1 }

  const action: DuelAction = {
    type: 'UPDATE_AGENT',
    cardId: updatedCardId,
    playerId,
    update,
  }

  const { cards } = duelReducer(stackedDuelStateMock, action)

  expect(cards[updatedCardId]).toMatchObject(update)
})

it('should enable target selection when TRIGGER_TARGET_SELECTION action is dispatched', () => {
  const targetId = stackedDuelStateMock.players[opponentId].board[0]
  const targets = [targetId]

  const action: DuelAction = {
    type: 'TRIGGER_TARGET_SELECTION',
    validTargets: targets,
    triggererId: '123',
    showTargetingModal: true,
  }

  const {
    phase,
    targeting: { validTargets, showTargetingModal },
  } = duelReducer(stackedDuelStateMock, action)

  expect(phase).toBe('Select Target')
  expect(validTargets).toEqual(targets)
  expect(showTargetingModal).toBe(true)
})

it('sould disable targeting when SELECT_TARGET action is dispatched', () => {
  const cardId = stackedDuelStateMock.players[opponentId].board[0]

  const action: DuelAction = { type: 'SELECT_TARGET', cardId }

  const duelState = stackedDuelStateMock
  duelState.targeting = {
    showTargetingModal: true,
    validTargets: [cardId],
    triggererId: '123',
  }

  const {
    targeting: { validTargets, showTargetingModal },
  } = duelReducer(stackedDuelStateMock, action)

  expect(validTargets).toEqual(initialState.targeting.validTargets)
  expect(showTargetingModal).toBe(initialState.targeting.showTargetingModal)
})

it('should gain coins when GAIN_COINS is triggered', () => {
  const amount = 5
  const action: DuelAction = { type: 'GAIN_COINS', playerId, amount }

  const { players } = duelReducer(initialDuelStateMock, action)

  expect(players[playerId].coins).toBe(
    initialDuelStateMock.players[playerId].coins + 5,
  )
})
