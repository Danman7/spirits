import { useEffect } from 'react'

import { Board, DuelProvider } from 'src/modules/duel'
import {
  initialDuelStateWithBotMock,
  userMock,
} from 'src/modules/duel/__mocks__'

import { useUser } from 'src/shared/modules/user'

export const App: React.FC = () => {
  const { dispatch } = useUser()

  useEffect(() => {
    dispatch({ type: 'LOAD_USER', user: userMock })

    return () => {
      dispatch({ type: 'RESET_USER' })
    }
  }, [dispatch])

  return (
    <DuelProvider preloadedState={initialDuelStateWithBotMock}>
      <Board />
    </DuelProvider>
  )
}
