import { FC, ReactNode, useEffect, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import LoadingMessage from 'src/features/duel/components/LoadingMessage'
import {
  opponentDecidingMessage,
  opponentTurnTitle,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import { completeRedraw, resolveTurn } from 'src/features/duel/slice'
import { DuelPhase, Player } from 'src/features/duel/types'
import { Link } from 'src/shared/components/Link'
import { SidePanel } from 'src/shared/components/SidePanel'

export interface ActionPanelProps {
  isOpen: boolean
  loggedInPlayer: Player
  isLoggedInPlayerActive: boolean
  phase: DuelPhase
}

const OppponentIsDeciding = () => (
  <LoadingMessage message={opponentDecidingMessage} />
)

export const ActionPanel: FC<ActionPanelProps> = ({
  isOpen,
  loggedInPlayer,
  isLoggedInPlayerActive,
  phase,
}) => {
  const { id, hasPerformedAction } = loggedInPlayer

  const dispatch = useAppDispatch()

  const [sidePanelContent, setSidePanelContent] = useState<ReactNode>(null)

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
            {isLoggedInPlayerActive ? (
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
  }, [dispatch, hasPerformedAction, id, isLoggedInPlayerActive, phase])

  return <SidePanel isOpen={isOpen}>{sidePanelContent}</SidePanel>
}
