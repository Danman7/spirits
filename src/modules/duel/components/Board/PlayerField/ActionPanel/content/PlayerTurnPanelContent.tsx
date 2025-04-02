import {
  opponentTurnTitle,
  passButtonMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel/components/Board/PlayerField/ActionPanel/ActionPanel.messages'
import { OppponentIsDeciding } from 'src/modules/duel/components/Board/PlayerField/ActionPanel/content'

import { Link } from 'src/shared/components'

export const PlayerTurnPanelContent: React.FC<{
  isUserActive: boolean
  onPassTurn: () => void
}> = ({ isUserActive, onPassTurn }) =>
  isUserActive ? (
    <>
      <h3>{yourTurnTitle}</h3>
      {yourTurnMessage}
      <Link onClick={onPassTurn}>{passButtonMessage}</Link>
    </>
  ) : (
    <>
      <h3>{opponentTurnTitle}</h3>
      <OppponentIsDeciding />
    </>
  )
