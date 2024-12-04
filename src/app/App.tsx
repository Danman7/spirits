import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import { initialPlayerMock, initialOpponentMock } from 'src/shared/__mocks__'
import Board from 'src/features/duel/components/Board'
import { getActivePlayerId } from 'src/features/duel/selectors'
import { initializeDuel } from 'src/features/duel/slice'

let hasInitializedDuel = false

const App = () => {
  const dispatch = useAppDispatch()

  const activePlayerId = useAppSelector(getActivePlayerId)

  useEffect(() => {
    if (!hasInitializedDuel) {
      hasInitializedDuel = true

      dispatch(
        initializeDuel({
          players: [initialPlayerMock, initialOpponentMock],
          loggedInPlayerId: initialPlayerMock.id,
          firstPlayerId: initialPlayerMock.id,
        }),
      )
    }
  }, [activePlayerId, dispatch])

  return activePlayerId ? <Board /> : null
}

export default App
