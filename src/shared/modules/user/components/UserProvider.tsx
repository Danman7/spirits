import { useReducer } from 'react'

import { UserContext } from 'src/shared/modules/user/components/UserContext'
import {
  initialState,
  userReducer,
} from 'src/shared/modules/user/state/user.reducer'
import type { User } from 'src/shared/modules/user/User.types'

export interface UserProviderProps {
  children: React.ReactNode
  preloadedState?: User
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  preloadedState,
}) => {
  const [state, dispatch] = useReducer(
    userReducer,
    preloadedState || initialState,
  )

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}
