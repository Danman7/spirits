import { initialState, loadUser, userReducer } from 'src/modules/user/slice'
import { playerId } from 'src/shared/__mocks__'
import { User } from 'src/shared/types'

let userState: User

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
