import { useReducer } from 'react'
import { initialState, UserContext, userReducer } from 'src/modules/user'
import { User } from 'src/shared/types'

export interface DuelProps {
  children: React.ReactNode
  preloadedState?: User
}

export const UserProvider: React.FC<DuelProps> = ({
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
