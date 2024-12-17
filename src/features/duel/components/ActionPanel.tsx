import { FC, ReactNode, useEffect, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import LoadingMessage from 'src/features/duel/components/LoadingMessage'
import {
  opponentDecidingMessage,
  passButtonMessage,
  redrawMessage,
  skipRedrawLinkMessage,
  yourTurnMessage,
} from 'src/features/duel/messages'
import { completeRedraw, initializeEndTurn } from 'src/features/duel/slice'
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
      case 'Pre-duel':
      case 'Redrawing Phase':
        setSidePanelContent(
          <>
            {hasPerformedAction ? (
              <OppponentIsDeciding />
            ) : (
              <>
                {redrawMessage}{' '}
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
                {yourTurnMessage}{' '}
                <Link onClick={() => dispatch(initializeEndTurn())}>
                  {passButtonMessage}
                </Link>
              </>
            ) : (
              <OppponentIsDeciding />
            )}
          </>,
        )
    }
  }, [dispatch, hasPerformedAction, id, isLoggedInPlayerActive, phase])

  return <SidePanel isOpen={isOpen}>{sidePanelContent}</SidePanel>
}
