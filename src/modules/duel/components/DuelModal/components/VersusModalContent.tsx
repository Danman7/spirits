import {
  firstPlayerMessage,
  versusMessage,
} from 'src/modules/duel/components/DuelModal/DuelModalMessages'
import {
  FirstPlayerBox,
  LeftPlayerName,
  PlayerNamesWrapper,
  RightPlayerName,
  Versus,
} from 'src/modules/duel/components/DuelModal/duelModalStyles'
import { useDuel } from 'src/modules/duel/state/context/DuelContext'

export const VersusModalContent = () => {
  const {
    state: {
      players,
      playerOrder: [activePlayerId, inactivePlayerId],
    },
  } = useDuel()

  const { name: firstPlayerName, color: firstPlayerColor } =
    players[activePlayerId]
  const { name: secontPlayerName, color: secondPlayerColor } =
    players[inactivePlayerId]

  return (
    <>
      <PlayerNamesWrapper>
        <LeftPlayerName $color={firstPlayerColor}>
          <h2>{firstPlayerName}</h2>
        </LeftPlayerName>
        <Versus>{versusMessage}</Versus>
        <RightPlayerName $color={secondPlayerColor}>
          <h2>{secontPlayerName}</h2>
        </RightPlayerName>
        <FirstPlayerBox>
          <h3
            style={{ color: firstPlayerColor }}
          >{`${firstPlayerName} ${firstPlayerMessage}`}</h3>
        </FirstPlayerBox>
      </PlayerNamesWrapper>
    </>
  )
}
