import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'src/app/store'
import Board from 'src/features/duel/components/Board'
import { getActivePlayerId } from 'src/features/duel/selectors'
import { initializeDuel } from 'src/features/duel/slice'
import { getUserId } from 'src/features/user/selector'
import { loadUser } from 'src/features/user/slice'
import {
  initialOpponentMock,
  initialPlayerMock,
  playerId,
} from 'src/shared/__mocks__'

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
        initializeDuel({
          players: [initialPlayerMock, initialOpponentMock],
          firstPlayerId: userId,
        }),
      )
    }
  }, [userId, dispatch])

  return activePlayerId ? <Board /> : null
}

export default App
