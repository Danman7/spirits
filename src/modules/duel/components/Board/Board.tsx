import { sortDuelPlayers, useDuel } from 'src/modules/duel'
import {
  ActionPanel,
  DuelModal,
  PlayerField,
  StyledBoard,
} from 'src/modules/duel/components'
import { useUser } from 'src/shared/user'

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
      {sortDuelPlayers(players, userId).map(({ id }, index) => (
        <PlayerField key={id} playerId={id} isOnTop={!index} />
      ))}

      <DuelModal />

      <ActionPanel />
    </StyledBoard>
  ) : null
}
