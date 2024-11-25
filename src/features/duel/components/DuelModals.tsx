import { motion } from 'motion/react'
import { FC, ReactNode, useEffect, useState } from 'react'

import { useAppDispatch } from 'src/app/store'
import LoadingMessage from 'src/features/duel/components/LoadingMessage'
import SidePanel from 'src/features/duel/components/SidePanel'
import { MODAL_TIMEOUT } from 'src/features/duel/constants'
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
import { getPlayableCardIds } from 'src/features/duel/utils'
import { SlideInOutOpacityVariants } from 'src/shared/animations'
import Link from 'src/shared/components/Link'
import Modal from 'src/shared/components/Modal'
import { getRandomArrayItem } from 'src/shared/utils'

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

  const [gameModalContent, setGameModalContent] = useState<ReactNode>(null)
  const [sidePanelContent, setSidePanelContent] = useState<ReactNode>(null)

  const onSkipRedraw = () => {
    dispatch(completeRedraw(id))
  }

  const onPass = () => {
    dispatch(initializeEndTurn())
  }

  const onModalExitComplete = () => {
    if (phase === 'Pre-duel') {
      dispatch(startInitialCardDraw())
      setSidePanelContent(
        <motion.div variants={SlideInOutOpacityVariants}>
          {hasPerformedAction ? (
            <LoadingMessage message={opponentDecidingMessage} />
          ) : (
            redrawMessage
          )}

          {!hasPerformedAction ? (
            <Link onClick={onSkipRedraw}>{skipRedrawLinkMessage}</Link>
          ) : null}
        </motion.div>,
      )
    }

    if (phase === 'Player Turn') {
      setSidePanelContent(
        <>
          <motion.div variants={SlideInOutOpacityVariants}>
            {isPlayerActive ? (
              yourTurnMessage
            ) : (
              <LoadingMessage message={opponentDecidingMessage} />
            )}

            {isPlayerActive && !hasPerformedAction ? (
              <Link onClick={onPass}>{passButtonMessage}</Link>
            ) : null}
          </motion.div>
        </>,
      )
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
        setGameModalContent(
          <>
            <motion.h1 variants={SlideInOutOpacityVariants}>
              {`${playerNames[0]} vs ${playerNames[1]}`}
            </motion.h1>
            <motion.div variants={SlideInOutOpacityVariants}>
              {isPlayerActive ? playerFirst : opponentFirst}
            </motion.div>
          </>,
        )

        setTimeout(() => {
          setGameModalContent(null)
        }, MODAL_TIMEOUT)

        break
      case 'Player Turn':
        if (!hasPerformedAction && !opponent.hasPerformedAction) {
          setSidePanelContent(null)

          setGameModalContent(
            <motion.h1 variants={SlideInOutOpacityVariants}>
              {isPlayerActive ? yourTurnTitle : opponentTurnTitle}
            </motion.h1>,
          )

          setTimeout(() => {
            setGameModalContent(null)
          }, MODAL_TIMEOUT)
        }

        break
    }
  }, [phase, turn, isPlayerActive, playerNames, hasPerformedAction, opponent])

  useEffect(() => {
    if (victorName) {
      setGameModalContent(
        <motion.h1 variants={SlideInOutOpacityVariants}>
          {`${victorName} ${victoryMessage}`}
        </motion.h1>,
      )
    }
  }, [victorName])

  useEffect(() => {
    if (hasPerformedAction) {
      setSidePanelContent(null)
    }
  }, [hasPerformedAction])

  return (
    <>
      <Modal onExitComplete={onModalExitComplete}>{gameModalContent}</Modal>
      <SidePanel>{sidePanelContent}</SidePanel>
    </>
  )
}

export default DuelModals
