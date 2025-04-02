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
      players,
      playerOrder: [activePlayerId],
    },
  } = useDuel()

  return activePlayerId ? (
    <StyledBoard>
      {sortPlayerIdsForBoard(players, userId).map((id, index) => (
        <PlayerField key={id} playerId={id} isOnTop={!index} />
      ))}

      <DuelModal />
    </StyledBoard>
  ) : null
}
