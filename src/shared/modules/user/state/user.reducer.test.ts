import {
  initialState,
  userReducer,
} from 'src/shared/modules/user/state/user.reducer'
import { User, UserAction } from 'src/shared/modules/user/User.types'

it('should load a user when LOAD_USER action is dispatched', () => {
  const action: UserAction = {
    type: 'LOAD_USER',
    user: {
      id: '123',
      name: 'John Doe',
      color: '#f40',
      deck: ['HammeriteNovice', 'TempleGuard'],
    },
  }

  const newState = userReducer(initialState, action)

  expect(newState).toEqual(action.user)
  expect(newState).not.toBe(initialState)
})

it('should reset user when RESET_USER action is dispatched', () => {
  const action: UserAction = { type: 'RESET_USER' }

  const previousState: User = {
    id: '123',
    name: 'John Doe',
    color: '#4f0',
    deck: ['HammeriteNovice'],
  }
  const newState = userReducer(previousState, action)

  expect(newState).toEqual(initialState)
  expect(newState).not.toBe(previousState)
})

it('should return current state for unknown actions', () => {
  const action = { type: 'UNKNOWN_ACTION' } as unknown as UserAction

  const previousState: User = {
    id: '456',
    name: 'Jane Doe',
    color: '#40f',
    deck: ['HammeriteNovice'],
  }
  const newState = userReducer(previousState, action)

  expect(newState).toBe(previousState)
})
