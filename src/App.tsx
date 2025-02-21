import { useEffect } from 'react'
import { Board, DuelProviderWithMiddleware } from 'src/modules/duel/components'
import { initialDuelStateMock, userMock } from 'src/shared/__mocks__'
import { useUser } from 'src/shared/user'

export const App: React.FC = () => {
  const { dispatch } = useUser()

  useEffect(() => {
    dispatch({ type: 'LOAD_USER', user: userMock })

    return () => {
      dispatch({ type: 'RESET_USER' })
    }
  }, [dispatch])

  return (
    <DuelProviderWithMiddleware preloadedState={initialDuelStateMock}>
      <Board />
    </DuelProviderWithMiddleware>
  )
}
