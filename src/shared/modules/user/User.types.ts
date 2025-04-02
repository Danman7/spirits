import type { CardBaseKey } from 'src/shared/modules/cards'
import type { Color } from 'src/shared/shared.types'

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
  | { type: 'LOAD_USER'; user: User }
  | { type: 'RESET_USER' }
