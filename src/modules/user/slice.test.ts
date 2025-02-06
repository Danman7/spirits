import { initialState, loadUser, userReducer } from 'src/modules/user'
import { userMock } from 'src/shared/__mocks__'
import { User } from 'src/shared/types'
import { deepClone } from 'src/shared/utils'

let userState: User

describe('Load the user', () => {
  beforeEach(() => {
    userState = deepClone(initialState)
  })

  it('should load the user', () => {
    const state = userReducer(userState, loadUser(userMock))

    expect(state).toEqual(userMock)
  })
})
