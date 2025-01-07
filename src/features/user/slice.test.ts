import { initialState, loadUser, userReducer } from 'src/features/user/slice'
import { UserState } from 'src/features/user/types'
import { playerId } from 'src/shared/__mocks__'

let userState: UserState

describe('Load the user', () => {
  beforeEach(() => {
    userState = { ...initialState }
  })

  test('initialize a new game with a random first player', () => {
    const state = userReducer(
      userState,
      loadUser({
        id: playerId,
      }),
    )

    const { id } = state

    expect(id).toBe(playerId)
  })
})
