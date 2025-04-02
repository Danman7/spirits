import { useContext } from 'react'

import { UserContext } from 'src/shared/modules/user/components/UserContext'
import { userContextError } from 'src/shared/modules/user/User.messages'

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error(userContextError)
  return context
}
