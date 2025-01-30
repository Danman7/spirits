import { FC, ReactNode, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/modules/duel/messages'
import {
  getActivePlayerId,
  getPhase,
  getPlayers,
} from 'src/modules/duel/selectors'
import { completeRedraw, resolveTurn } from 'src/modules/duel/slice'
import { getUserId } from 'src/modules/user/selectors'
import { Link, LoadingMessage, SidePanel } from 'src/shared/components'

const OppponentIsDeciding = () => (
  <LoadingMessage message={opponentDecidingMessage} />
)

export const ActionPanel: FC = () => {
  const dispatch = useAppDispatch()
  const players = useAppSelector(getPlayers)
  const phase = useAppSelector(getPhase)
  const activePlayerId = useAppSelector(getActivePlayerId)
  const userId = useAppSelector(getUserId)

  const player = players[userId]
  const { id, hasPerformedAction } = player
  const isActive = player.id === activePlayerId

  const [sidePanelContent, setSidePanelContent] = useState<ReactNode>(null)

  const isOpen =
    phase === 'Redrawing' ||
    (phase === 'Player Turn' && !isActive) ||
    (phase === 'Player Turn' && isActive && !hasPerformedAction)

  const onPassTurn = () => dispatch(resolveTurn())

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
                <Link onClick={() => dispatch(completeRedraw(id))}>
                  {skipRedrawLinkMessage}
                </Link>
              </>
            )}
          </>,
        )

        break

      case 'Player Turn':
        setSidePanelContent(
          <>
            {isActive ? (
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
  }, [dispatch, hasPerformedAction, id, isActive, phase])

  return <SidePanel isOpen={isOpen}>{sidePanelContent}</SidePanel>
}
