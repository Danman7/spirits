import { FC, ReactNode, useEffect, useState } from 'react'

import { useAppDispatch, useAppSelector } from 'src/app/store'
import LoadingMessage from 'src/shared/components/LoadingMessage'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import {
  getActivePlayerId,
  getPhase,
  getPlayers,
} from 'src/features/duel/selectors'
import { completeRedraw, resolveTurn } from 'src/features/duel/slice'
import { getUserId } from 'src/features/user/selectors'
import { Link } from 'src/shared/components/Link'
import { SidePanel } from 'src/shared/components/SidePanel'

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
                <Link onClick={() => dispatch(resolveTurn())}>
                  {passButtonMessage}
                </Link>
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
