import { useEffect } from 'react'
import { Table } from './Game/components/Table'
import { useDispatch } from 'react-redux'
import { GameActions } from './Game/GameSlice'
import { MockPlayer1, MockPlayer2 } from './utils/mocks'

export const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(
      GameActions.startGame({
        topPlayer: MockPlayer1,
        bottomPlayer: MockPlayer2
      })
    )
  }, [dispatch])

  return <Table />
}
