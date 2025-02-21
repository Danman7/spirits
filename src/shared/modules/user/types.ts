import { CardBaseKey } from 'src/shared/modules/cards/types'

export interface User {
  id: string
  name: string
  deck: CardBaseKey[]
}

export interface Bot extends User {
  isBot: true
}

export type UserAction =
  | {
      type: 'LOAD_USER'
      user: User
    }
  | { type: 'RESET_USER' }
