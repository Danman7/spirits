import { createContext, useContext } from 'react'
import { UserAction, User } from 'src/shared/modules/user/types'

export const UserContext = createContext<
  { state: User; dispatch: React.Dispatch<UserAction> } | undefined
>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
