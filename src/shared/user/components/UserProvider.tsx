import { useReducer } from 'react'
import { initialState, UserContext, userReducer } from 'src/shared/user'
import { User } from 'src/shared/types'

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
