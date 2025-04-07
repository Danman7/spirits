import { initialDuelStateMock } from 'src/modules/duel/__mocks__'
import type { DuelAction, DuelState } from 'src/modules/duel/state'

it('calls effect and dispatches side effect when predicate matches', async () => {
  const mockDispatch = jest.fn()

  const matchingTrigger = {
    predicate: jest.fn(() => true),
    effect: jest.fn(({ dispatch }) => {
      dispatch({ type: 'ADVANCE_TURN' })
    }),
  }

  const nonMatchingTrigger = {
    predicate: jest.fn(() => false),
    effect: jest.fn(),
  }

  // Dynamically mock BEFORE importing the middleware
  jest.doMock('src/modules/duel/state/triggers', () => ({
    duelTriggers: [matchingTrigger, nonMatchingTrigger],
  }))

  // Re-import AFTER mock is in place
  const { duelProviderMiddleware } = await import(
    'src/modules/duel/components/DuelProvider/DuelProvider.middleware'
  )

  const dummyState: DuelState = initialDuelStateMock
  const dummyAction: DuelAction = { type: 'ADVANCE_TURN' }

  duelProviderMiddleware(dummyState, dummyAction, mockDispatch)

  expect(matchingTrigger.predicate).toHaveBeenCalledWith(
    dummyState,
    dummyAction,
  )

  expect(matchingTrigger.effect).toHaveBeenCalledWith({
    state: dummyState,
    action: dummyAction,
    dispatch: mockDispatch,
  })

  expect(mockDispatch).toHaveBeenCalledWith({ type: 'ADVANCE_TURN' })

  expect(nonMatchingTrigger.predicate).toHaveBeenCalled()
  expect(nonMatchingTrigger.effect).not.toHaveBeenCalled()
})
