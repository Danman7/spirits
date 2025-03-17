import {
  opponentTurnTitle,
  passButtonMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel/components/ActionPanel/ActionPanelMessages'
import { OppponentIsDeciding } from 'src/modules/duel/components/ActionPanel/components/OpponentIsDeciding'
import { Link } from 'src/shared/components/Link'

export const PlayerTurnPanelContent = ({
  isUserActive,
  onPassTurn,
}: {
  isUserActive: boolean
  onPassTurn: () => void
}) =>
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
