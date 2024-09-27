import { FC } from 'react'
import { motion } from 'framer-motion'

import { SlideInOutContentVariants } from 'src/shared/animations'
import { useAppDispatch, useAppSelector } from 'src/app/store'

import { getPlayerPrespective } from 'src/features/duel/selectors'
import {
  opponentTurnTitle,
  passButtonMessage,
  yourTurnMessage,
  yourTurnTitle,
} from 'src/features/duel/messages'
import Link from 'src/shared/components/Link'
import { endTurn } from 'src/features/duel/slice'

const PlayerTurnModal: FC = () => {
  const dispatch = useAppDispatch()

  const playerPrespective = useAppSelector(getPlayerPrespective)

  const playerIsActive = playerPrespective.isActive

  const onPassOrEndTurn = () => {
    dispatch(endTurn())
  }

  const buttonLabel = playerIsActive ? passButtonMessage : ''

  return (
    <div style={{ width: 250 }}>
      <motion.h2 variants={SlideInOutContentVariants}>
        {playerIsActive ? yourTurnTitle : opponentTurnTitle}
      </motion.h2>

      {playerIsActive && (
        <motion.p variants={SlideInOutContentVariants}>
          {yourTurnMessage}
        </motion.p>
      )}

      {buttonLabel && (
        <motion.div
          style={{ marginTop: '0.5rem' }}
          variants={SlideInOutContentVariants}
        >
          <Link onClick={onPassOrEndTurn}>{buttonLabel}</Link>
        </motion.div>
      )}
    </div>
  )
}

export default PlayerTurnModal
