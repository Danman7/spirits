import { createContext } from 'react'

import { User, UserAction } from 'src/shared/modules/user/User.types'

export const UserContext = createContext<
  { state: User; dispatch: React.Dispatch<UserAction> } | undefined
>(undefined)
