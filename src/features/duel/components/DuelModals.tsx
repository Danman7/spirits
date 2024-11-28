import { FC, ReactNode, useEffect, useMemo, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import LoadingMessage from 'src/features/duel/components/LoadingMessage'
import SidePanel from 'src/shared/components/SidePanel'
import {
  opponentDecidingMessage,
  opponentFirst,
  opponentTurnTitle,
  passButtonMessage,
  playerFirst,
  redrawMessage,
  skipRedrawLinkMessage,
  victoryMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import {
  completeRedraw,
  initializeEndTurn,
  playCard,
  startInitialCardDraw,
} from 'src/features/duel/slice'
import { DuelPhase, Player } from 'src/features/duel/types'
import Link from 'src/shared/components/Link'
import Modal from 'src/shared/components/Modal'
import { PHASE_MODAL_TIMEOUT } from 'src/shared/constants'
import { getPlayableCardIds, getRandomArrayItem } from 'src/shared/utils'

const openAndClosePhaseModal = (
  setModalVisibility: (isOpen: boolean) => void,
) => {
  setModalVisibility(true)

  setTimeout(() => {
    setModalVisibility(false)
  }, PHASE_MODAL_TIMEOUT)
}

export interface DuelModalsProps {
  player: Player
  opponent: Player
  isPlayerActive: boolean
  turn: number
  phase: DuelPhase
  playerNames: string[]
  victorName?: string
}

const DuelModals: FC<DuelModalsProps> = ({
  player,
  opponent,
  isPlayerActive,
  turn,
  phase,
  victorName,
  playerNames,
}) => {
  const { id, hasPerformedAction } = player

  const dispatch = useAppDispatch()

  const [isPhaseModalOpen, setIsPhaseModalOpen] = useState(false)
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)

  const onPhaseModalClosed = () => {
    if (phase === 'Pre-duel') {
      dispatch(startInitialCardDraw())
      setIsSidePanelOpen(true)
    }

    if (phase === 'Player Turn') {
      setIsSidePanelOpen(true)
    }

    if (
      !isPlayerActive &&
      opponent.isCPU &&
      phase === 'Player Turn' &&
      !opponent.hasPerformedAction
    ) {
      // Play random card for now
      const playableCardIds = getPlayableCardIds(opponent)

      if (playableCardIds.length) {
        const cardId = getRandomArrayItem(playableCardIds)

        dispatch(
          playCard({
            cardId,
            playerId: opponent.id,
          }),
        )
      }
    }
  }

  useEffect(() => {
    switch (phase) {
      case 'Pre-duel':
        openAndClosePhaseModal(setIsPhaseModalOpen)

        break
      case 'Player Turn':
        if (!hasPerformedAction && !opponent.hasPerformedAction) {
          setIsSidePanelOpen(false)
          openAndClosePhaseModal(setIsPhaseModalOpen)
        }

        break
    }
  }, [phase, turn, isPlayerActive, playerNames, hasPerformedAction, opponent])

  useEffect(() => {
    if (hasPerformedAction) {
      setIsSidePanelOpen(false)
    }
  }, [hasPerformedAction])

  const phaseModalContent: ReactNode = useMemo(() => {
    if (victorName) {
      return <h1>{`${victorName} ${victoryMessage}`}</h1>
    }

    switch (phase) {
      case 'Pre-duel':
        return (
          <>
            <h1>{`${playerNames[0]} vs ${playerNames[1]}`}</h1>
            <div>{isPlayerActive ? playerFirst : opponentFirst}</div>
          </>
        )

      case 'Player Turn':
        return <h1>{isPlayerActive ? yourTurnTitle : opponentTurnTitle}</h1>
    }
  }, [phase, isPlayerActive, playerNames, victorName])

  const sidePanelContent: ReactNode = useMemo(() => {
    switch (phase) {
      case 'Pre-duel':
      case 'Redrawing Phase':
        return (
          <>
            {hasPerformedAction ? (
              <LoadingMessage message={opponentDecidingMessage} />
            ) : (
              redrawMessage
            )}

            {!hasPerformedAction ? (
              <Link onClick={() => dispatch(completeRedraw(id))}>
                {skipRedrawLinkMessage}
              </Link>
            ) : null}
          </>
        )

      case 'Player Turn':
        return (
          <>
            {isPlayerActive ? (
              yourTurnMessage
            ) : (
              <LoadingMessage message={opponentDecidingMessage} />
            )}

            {isPlayerActive && !hasPerformedAction ? (
              <Link onClick={() => dispatch(initializeEndTurn())}>
                {passButtonMessage}
              </Link>
            ) : null}
          </>
        )
    }
  }, [dispatch, hasPerformedAction, id, isPlayerActive, phase])

  return (
    <>
      <Modal isOpen={isPhaseModalOpen} onClosingComplete={onPhaseModalClosed}>
        {phaseModalContent}
      </Modal>
      <SidePanel isOpen={isSidePanelOpen}>{sidePanelContent}</SidePanel>
    </>
  )
}

export default DuelModals
