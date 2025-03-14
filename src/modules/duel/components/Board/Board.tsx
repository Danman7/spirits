import { ActionPanel } from 'src/modules/duel/components/ActionPanel'
import {
  LeftPanelsWrapper,
  StyledBoard,
} from 'src/modules/duel/components/Board/BoardStyles'
import { DuelModal } from 'src/modules/duel/components/DuelModal'
import { LogsPanel } from 'src/modules/duel/components/LogsPanel'
import { PlayerField } from 'src/modules/duel/components/PlayerField'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'
import { sortPlayerIdsForBoard } from 'src/modules/duel/duelUtils'
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

      <LeftPanelsWrapper>
        <LogsPanel />
        <ActionPanel />
      </LeftPanelsWrapper>
    </StyledBoard>
  ) : null
}
