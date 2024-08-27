import { useEffect } from 'react'

import Board from 'src/Game/components/Board'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'
import { PlayTestPlayer1, PlayTestPlayer2 } from 'src/shared/__mocks__/players'
import { useAppDispatch } from 'src/shared/redux/hooks'

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      GameActions.initializeGame({
        players: [PlayTestPlayer1, PlayTestPlayer2],
        firstPlayerId: PlayTestPlayer1.id
      })
    )
  }, [dispatch])

  return <Board />
}
