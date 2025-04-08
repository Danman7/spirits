import {
  initialDuelStateMock,
  opponentId,
  playerId,
  stackedDuelStateMock,
} from 'src/modules/duel/__mocks__'
import type { DuelAction } from 'src/modules/duel/state'
import { duelReducer } from 'src/modules/duel/state'

it('should set player hasPerformedAction to true when SKIP_REDRAW action is dispatched', () => {
  const action: DuelAction = { type: 'SKIP_REDRAW', playerId }

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
  const action: DuelAction = { type: 'COMPLETE_REDRAW' }

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
