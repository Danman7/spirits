import { useEffect } from 'react'
import { Board } from './Game/components/Board'
import { GameActions } from './Game/GameSlice'
import { MockPlayer1, MockPlayer2 } from './utils/mocks'
import { useAppDispatch } from './state'

export const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      GameActions.startGame({
        topPlayer: MockPlayer1,
        bottomPlayer: MockPlayer2
      })
    )
  }, [dispatch])

  return <Board />
}
