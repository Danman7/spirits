import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import { Board } from 'src/modules/duel/components'
import { getActivePlayerId, startDuel } from 'src/modules/duel'
import { getUserId, loadUser } from 'src/modules/user'
import { opponentMock, playerId, userMock } from 'src/shared/__mocks__'

let hasLoadedUser = false

export const App = () => {
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
