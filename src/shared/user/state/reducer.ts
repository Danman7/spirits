import { UserAction } from 'src/shared/user'
import { User } from 'src/shared/types'

export const initialState: User = {
  id: '',
  name: '',
  deck: [],
}

export const userReducer = (
  state: Readonly<User>,
  action: UserAction,
): User => {
  switch (action.type) {
    case 'LOAD_USER': {
      return { ...action.user }
    }

    default:
      return state
  }
}
