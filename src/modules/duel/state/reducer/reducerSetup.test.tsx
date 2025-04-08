import {
  initialDuelStateMock,
  opponentId,
  opponentMock,
  stackedDuelStateMock,
  userMock,
} from 'src/modules/duel/__mocks__'
import {
  INITIAL_CARDS_DRAWN_IN_DUEL,
  STARTING_COINS_IN_DUEL,
} from 'src/modules/duel/duel.constants'
import type {
  DuelAction,
  DuelState,
  UsersStartingDuel,
} from 'src/modules/duel/state'
import { duelReducer, initialState } from 'src/modules/duel/state'

const users: UsersStartingDuel = [userMock, opponentMock]

it('should start a duel with a random first player when START_DUEL action is dispatched without firstPlayerIndex', () => {
  const action: DuelAction = { type: 'START_DUEL', users }

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
  const action: DuelAction = { type: 'START_DUEL', users, firstPlayerIndex: 1 }

  const { playerOrder } = duelReducer(initialState, action)

  expect(playerOrder).toEqual([opponentMock.id, userMock.id])
})

it('should draw initial cards when DRAW_INITIAL_CARDS action is dispatched', () => {
  const action: DuelAction = { type: 'DRAW_INITIAL_CARDS' }

  const { players } = duelReducer(initialDuelStateMock, action)

  Object.keys(players).forEach((playerId) => {
    const { hand } = players[playerId]

    expect(hand).toHaveLength(INITIAL_CARDS_DRAWN_IN_DUEL)
  })
})

it('should return current state for unknown actions', () => {
  const action = { type: 'UNKNOWN_ACTION' } as unknown as DuelAction

  const previousState: DuelState = { ...initialState, phase: 'Resolving turn' }
  const newState = duelReducer(previousState, action)

  expect(newState).toBe(previousState)
})

it('should be able to add a message to the logs', () => {
  const opponent = stackedDuelStateMock.players[opponentId]
  const message: React.ReactNode = (
    <p>
      {opponent.name} has played{' '}
      {stackedDuelStateMock.cards[opponent.hand[0]].name}.
    </p>
  )
  const action: DuelAction = { type: 'ADD_LOG', message }

  const { logs } = duelReducer(initialDuelStateMock, action)
  expect(logs).toContain(message)
})
