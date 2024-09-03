import Board from 'src/Game/components/Board'
import { PlayTestPlayer1, PlayTestPlayer2 } from 'src/shared/__mocks__/players'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import store from 'src/shared/redux/store'

if (typeof window !== 'undefined') {
  store.dispatch(
    GameActions.initializeGame({
      players: [PlayTestPlayer1, PlayTestPlayer2],
      loggedInPlayerId: PlayTestPlayer1.id,
      firstPlayerId: PlayTestPlayer1.id
    })
  )
}

const App = () => <Board />

export default App
