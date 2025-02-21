import { ReactNode } from 'react'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawingtitle,
  redrawMessage,
  skipRedrawLinkMessage,
  useDuel,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel'
import { Link, LoadingMessage, SidePanel } from 'src/shared/components'
import { useUser } from 'src/shared/user'

const OppponentIsDeciding = () => (
  <LoadingMessage message={opponentDecidingMessage} />
)

export const ActionPanel: React.FC = () => {
  const {
    state: { id: userId },
  } = useUser()

  const {
    state: {
      players,
      phase,
      playerOrder: [activePlayerId],
    },
    dispatch,
  } = useDuel()

  const player = players[userId]

  if (!player) return null

  const { id: playerId, hasPerformedAction } = player
  const isUserActive = userId === activePlayerId

  const isOpen =
    phase === 'Redrawing' ||
    (phase === 'Player Turn' && !isUserActive) ||
    (phase === 'Player Turn' && isUserActive && !hasPerformedAction)

  const onPassTurn = () =>
    dispatch({
      type: 'RESOLVE_TURN',
    })

  const onReady = () =>
    dispatch({
      type: 'PLAYER_READY',
      playerId,
    })

  const sidePanelContent = (): ReactNode => {
    switch (phase) {
      case 'Redrawing':
        return (
          <>
            <h3>{redrawingtitle}</h3>
            {hasPerformedAction ? (
              <OppponentIsDeciding />
            ) : (
              <>
                {redrawMessage}
                <Link onClick={onReady}>{skipRedrawLinkMessage}</Link>
              </>
            )}
          </>
        )

      case 'Player Turn':
        return isUserActive ? (
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

      default:
        return ''
    }
  }

  return <SidePanel isOpen={isOpen}>{sidePanelContent()}</SidePanel>
}
