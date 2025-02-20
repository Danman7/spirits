import { createContext, useContext } from 'react'
import { UserAction } from 'src/shared/user'
import { User } from 'src/shared/types'

export const UserContext = createContext<
  { state: User; dispatch: React.Dispatch<UserAction> } | undefined
>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within a UserProvider')
  return context
}
