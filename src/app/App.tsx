import store from 'src/app/store'
import { PlayTestPlayer1, PlayTestPlayer2 } from 'src/features/duel/__mocks__'
import Board from 'src/features/duel/components/Board'
import { initializeGame } from 'src/features/duel/slice'
import { DuelPhase } from 'src/features/duel/types'

store.dispatch(
  initializeGame({
    players: [PlayTestPlayer1, PlayTestPlayer2],
    loggedInPlayerId: PlayTestPlayer1.id,
    firstPlayerId: PlayTestPlayer1.id,
    phase: DuelPhase.PLAYER_TURN
  })
)

const App = () => <Board />

export default App
