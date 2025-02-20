import { useEffect } from 'react'
import { Board, DuelProviderWithMiddleware } from 'src/modules/duel/components'
import { useUser } from 'src/shared/user'
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

  return userId ? (
    <DuelProviderWithMiddleware preloadedState={initialDuelStateMock}>
      <Board />
    </DuelProviderWithMiddleware>
  ) : null
}
