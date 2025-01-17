import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import { Board } from 'src/features/duel/components/Board'
import { getActivePlayerId } from 'src/features/duel/selectors'
import { startDuel } from 'src/features/duel/slice'
import { getUserId } from 'src/features/user/selectors'
import { loadUser } from 'src/features/user/slice'
import { opponentMock, playerId, userMock } from 'src/shared/__mocks__'

let hasLoadedUser = false

const App = () => {
  const dispatch = useAppDispatch()
  const activePlayerId = useAppSelector(getActivePlayerId)
  const userId = useAppSelector(getUserId)

  useEffect(() => {
    if (!hasLoadedUser) {
      hasLoadedUser = true

      dispatch(
        loadUser({
          id: playerId,
        }),
      )
    }
  }, [dispatch])

  useEffect(() => {
    if (userId) {
      dispatch(
        startDuel({
          users: [userMock, opponentMock],
          firstPlayerId: userId,
        }),
      )
    }
  }, [userId, dispatch])

  return activePlayerId ? <Board /> : null
}

export default App
