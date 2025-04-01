import { StyledBoard } from 'src/modules/duel/components/Board/BoardStyles'
import { DuelModal } from 'src/modules/duel/components/DuelModal'
import { PlayerField } from 'src/modules/duel/components/PlayerField'
import { sortPlayerIdsForBoard } from 'src/modules/duel/duelUtils'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { useUser } from 'src/shared/modules/user/state/UserContext'

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
