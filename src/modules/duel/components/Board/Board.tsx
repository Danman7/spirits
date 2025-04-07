import { useEffect } from 'react'

import { StyledBoard } from 'src/modules/duel/components/Board/Board.styles'
import { DuelModal } from 'src/modules/duel/components/Board/DuelModal'
import { PlayerField } from 'src/modules/duel/components/Board/PlayerField'
import { useDuel } from 'src/modules/duel/components/DuelProvider/useDuel'
import { sortPlayerIdsForBoard } from 'src/modules/duel/duel.utils'

import { useUser } from 'src/shared/modules/user'

export const Board: React.FC = () => {
  const { state: user } = useUser()
  const { id: userId } = user

  const {
    state: {
      phase,
      players,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  useEffect(() => {
    if (phase !== 'Initial Draw') return

    dispatch({ type: 'DRAW_INITIAL_CARDS' })
  }, [phase, dispatch])

  if (!userId || !activePlayerId) return null

  return (
    <StyledBoard>
      {sortPlayerIdsForBoard(players, userId).map((id, index) => (
        <PlayerField key={id} playerId={id} isOnTop={!index} />
      ))}

      <DuelModal />
    </StyledBoard>
  )
}
