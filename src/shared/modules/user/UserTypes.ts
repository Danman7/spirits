import { CardBaseKey } from 'src/shared/modules/cards/CardTypes'
import { Color } from 'src/shared/SharedTypes'

export interface User {
  id: string
  name: string
  color: Color
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
