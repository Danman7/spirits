import { createContext, useContext } from 'react'
import { userContextError } from 'src/shared/modules/user/messages'
import { User, UserAction } from 'src/shared/modules/user/types'

export const UserContext = createContext<
  { state: User; dispatch: React.Dispatch<UserAction> } | undefined
>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error(userContextError)
  return context
}
