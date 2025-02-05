import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import { getActivePlayerId, startDuel } from 'src/modules/duel'
import { Board } from 'src/modules/duel/components'
import { getUserId, loadUser } from 'src/modules/user'
import { opponentMock, playerId, userMock } from 'src/shared/__mocks__'

export const App = () => {
  const dispatch = useAppDispatch()
  const activePlayerId = useAppSelector(getActivePlayerId)
  const userId = useAppSelector(getUserId)
  const hasLoadedUser = useRef(false)

  useEffect(() => {
    if (!hasLoadedUser.current) {
      hasLoadedUser.current = true

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
