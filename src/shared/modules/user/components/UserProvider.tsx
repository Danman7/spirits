import { useReducer } from 'react'
import { UserContext } from 'src/shared/modules/user/state/UserContext'
import {
  initialState,
  userReducer,
} from 'src/shared/modules/user/state/userReducer'
import { User } from 'src/shared/modules/user/UserTypes'

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
