import store from 'src/app/store'
import { PlayTestPlayer1, PlayTestPlayer2 } from 'src/features/duel/__mocks__'
import Board from 'src/features/duel/components/Board'
import { initializeDuel } from 'src/features/duel/slice'

store.dispatch(
  initializeDuel({
    players: [PlayTestPlayer1, PlayTestPlayer2],
    loggedInPlayerId: PlayTestPlayer1.id,
    firstPlayerId: PlayTestPlayer1.id,
  }),
)

const App = () => <Board />

export default App
