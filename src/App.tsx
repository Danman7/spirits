import { useEffect } from 'react'
import { Board } from './Game/components/Board'
import { GameActions } from './Game/GameSlice'
import { PlayTestPlayer1, PlayTestPlayer2 } from './utils/mocks'
import { useAppDispatch } from './state'

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      GameActions.startGame({
        topPlayer: PlayTestPlayer2,
        bottomPlayer: PlayTestPlayer1
      })
    )
  }, [dispatch])

  return <Board />
}
