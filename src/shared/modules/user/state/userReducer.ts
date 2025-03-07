import { User, UserAction } from 'src/shared/modules/user/UserTypes'

export const initialState: User = {
  id: '',
  name: '',
  color: '',
  deck: [],
}

export const userReducer = (
  state: Readonly<User>,
  action: UserAction,
): User => {
  switch (action.type) {
    case 'LOAD_USER': {
      return action.user
    }

    case 'RESET_USER': {
      return initialState
    }

    default:
      return state
  }
}
