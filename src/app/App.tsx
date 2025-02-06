import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app'
import { getActivePlayerId, startDuel } from 'src/modules/duel'
import { Board } from 'src/modules/duel/components'
import { getUserId, loadUser } from 'src/modules/user'
import { opponentMock, userMock } from 'src/shared/__mocks__'

export const App = () => {
  const dispatch = useAppDispatch()
  const activePlayerId = useAppSelector(getActivePlayerId)
  const userId = useAppSelector(getUserId)
  let { current: hasLoadedUser } = useRef(false)

  useEffect(() => {
    if (hasLoadedUser) return
    hasLoadedUser = true

    dispatch(loadUser(userMock))
  }, [])

  useEffect(() => {
    if (!userId) return

    dispatch(
      startDuel({
        users: [userMock, opponentMock],
        firstPlayerId: userId,
      }),
    )
  }, [userId])

  return activePlayerId ? <Board /> : null
}
