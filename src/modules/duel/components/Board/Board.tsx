import { ActionPanel } from 'src/modules/duel/components/ActionPanel'
import {
  LeftPanelsWrapper,
  StyledBoard,
} from 'src/modules/duel/components/Board/styles'
import { DuelModal } from 'src/modules/duel/components/DuelModal'
import { LogsPanel } from 'src/modules/duel/components/LogsPanel'
import { PlayerField } from 'src/modules/duel/components/PlayerField'
import { useDuel } from 'src/modules/duel/state/DuelContext'
import { sortDuelPlayerIdsForBoard } from 'src/modules/duel/utils'
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
      {sortDuelPlayerIdsForBoard(players, userId).map((id, index) => (
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
