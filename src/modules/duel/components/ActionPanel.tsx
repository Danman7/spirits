import { ReactNode, useEffect, useState } from 'react'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  useDuel,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel'
import { useUser } from 'src/modules/user'
import { Link, LoadingMessage, SidePanel } from 'src/shared/components'

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
  const { id: playerId, hasPerformedAction } = player
  const isUserActive = userId === activePlayerId

  const [sidePanelContent, setSidePanelContent] = useState<ReactNode>(null)

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

  useEffect(() => {
    switch (phase) {
      case 'Redrawing':
        setSidePanelContent(
          <>
            <h3>Redrawing Phase</h3>
            {hasPerformedAction ? (
              <OppponentIsDeciding />
            ) : (
              <>
                {redrawMessage}
                <Link onClick={onReady}>{skipRedrawLinkMessage}</Link>
              </>
            )}
          </>,
        )

        break

      case 'Player Turn':
        setSidePanelContent(
          <>
            {isUserActive ? (
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
            )}
          </>,
        )
    }
  }, [hasPerformedAction, isUserActive, phase])

  return <SidePanel isOpen={isOpen}>{sidePanelContent}</SidePanel>
}
