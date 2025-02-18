import { useEffect } from 'react'
import { Duel } from 'src/modules/duel/components'
import { useUser } from 'src/modules/user'
import { initialDuelStateMock, userMock } from 'src/shared/__mocks__'

let hasLoadedUser = false

export const App: React.FC = () => {
  const {
    state: { id: userId },
    dispatch,
  } = useUser()

  useEffect(() => {
    if (hasLoadedUser) return
    hasLoadedUser = true

    dispatch({
      type: 'LOAD_USER',
      user: userMock,
    })
  }, [])

  return userId ? <Duel preloadedState={initialDuelStateMock} /> : null
}
