import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/animations'
import { useAppDispatch, useAppSelector } from 'src/app/store'

import {
  getActivePlayerId,
  getPlayerPrespective,
} from 'src/features/duel/selectors'
import {
  opponentTurnMessage,
  opponentTurnTitle,
  passButtonMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import Link from 'src/shared/components/Link'
import { initializeEndTurn } from 'src/features/duel/slice'

const PlayerTurnModal: FC = () => {
  const dispatch = useAppDispatch()

  const playerPrespective = useAppSelector(getPlayerPrespective)
  const activePlayerId = useAppSelector(getActivePlayerId)

  const playerIsActive = playerPrespective.id === activePlayerId

  const onPass = () => {
    dispatch(initializeEndTurn())
  }

  const buttonLabel = playerIsActive ? passButtonMessage : ''

  return (
    <div style={{ width: 250 }}>
      <motion.h2 variants={SlideInOutContentVariants}>
        {playerIsActive ? yourTurnTitle : opponentTurnTitle}
      </motion.h2>

      <motion.p variants={SlideInOutContentVariants}>
        {playerIsActive ? yourTurnMessage : opponentTurnMessage}
      </motion.p>

      {buttonLabel && !playerPrespective.hasPerformedAction && (
        <motion.div
          style={{ marginTop: '0.5rem' }}
          variants={SlideInOutContentVariants}
        >
          <Link onClick={onPass}>{buttonLabel}</Link>
        </motion.div>
      )}
    </div>
  )
}

export default PlayerTurnModal
