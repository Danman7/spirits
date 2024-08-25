import { useEffect } from 'react'

import Board from 'src/Game/components/Board'
import { GameActions } from 'src/Game/GameSlice'
import { PlayTestPlayer1, PlayTestPlayer2 } from 'src/shared/__mocks__/players'
import { useAppDispatch } from 'src/shared/redux/hooks'

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      GameActions.startGame({
        topPlayer: PlayTestPlayer2,
        bottomPlayer: PlayTestPlayer1,
        isPlayerFirst: true
      })
    )
  }, [dispatch])

  return <Board />
}
