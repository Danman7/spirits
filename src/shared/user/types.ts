import { User } from 'src/shared/types'

export type UserAction =
  | {
      type: 'LOAD_USER'
      user: User
    }
  | { type: 'RESET_USER' }
