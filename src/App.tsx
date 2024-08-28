import { useEffect } from 'react'

import Board from 'src/Game/components/Board'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { MockPlayer1, MockPlayer2 } from 'src/shared/__mocks__/players'
import { useAppDispatch } from 'src/shared/redux/hooks'

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      GameActions.initializeGame({
        players: [MockPlayer1, MockPlayer2],
        firstPlayerId: MockPlayer1.id
      })
    )
  }, [dispatch])

  return <Board />
}
