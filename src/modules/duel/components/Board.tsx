import { sortDuelPlayers, useDuel } from 'src/modules/duel'
import {
  ActionPanel,
  DuelModal,
  PlayerField,
  StyledBoard,
} from 'src/modules/duel/components'
import { useUser } from 'src/modules/user'

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
      {sortDuelPlayers(players, userId).map((player, index) => (
        <PlayerField
          key={player.id}
          player={player}
          isOnTop={!index}
          isActive={player.id === activePlayerId}
        />
      ))}

      <DuelModal />

      <ActionPanel />
    </StyledBoard>
  ) : null
}
