import {
  usePlayCard,
  useSkipRedraw,
} from 'src/modules/duel/components/Board/PlayerField/BotController/hooks'

export const BotController: React.FC<{ playerId: string }> = ({ playerId }) => {
  useSkipRedraw(playerId)

  usePlayCard(playerId)

  return <></>
}
