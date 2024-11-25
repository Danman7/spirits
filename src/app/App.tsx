import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import { PlayTestPlayer1, PlayTestPlayer2 } from 'src/features/duel/__mocks__'
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
          players: [PlayTestPlayer1, PlayTestPlayer2],
          loggedInPlayerId: PlayTestPlayer1.id,
          firstPlayerId: PlayTestPlayer1.id,
        }),
      )
    }
  }, [activePlayerId, dispatch])

  return activePlayerId ? <Board /> : null
}

export default App
