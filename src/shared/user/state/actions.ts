import { UserAction } from 'src/shared/user'
import { User } from 'src/shared/types'

export const loadUser = (user: User): UserAction => ({
  type: 'LOAD_USER',
  user,
})
