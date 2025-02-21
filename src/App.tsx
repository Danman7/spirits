import { useEffect } from 'react'
import { initialDuelStateMock, userMock } from 'src/modules/duel/__mocks__'
import { Board } from 'src/modules/duel/components/Board'
import { DuelProviderWithMiddleware } from 'src/modules/duel/components/DuelProviderWithMiddleware'
import { useUser } from 'src/shared/modules/user/state/UserContext'

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
