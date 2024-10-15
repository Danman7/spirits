import { FC } from 'react'
import { motion } from 'framer-motion'

import Link from 'src/shared/components/Link'
import { SlideInOutContentVariants } from 'src/shared/animations'
import { useAppDispatch, useAppSelector } from 'src/app/store'
import { Player } from 'src/features/duel/types'
import { completeRedraw } from 'src/features/duel/slice'
import {
  opponentDecidingMessage,
  redrawingPhaseModalTitle,
  redrawMessage,
  skipRedrawMessage,
} from 'src/features/duel/messages'
import { getPlayerIsReady } from 'src/features/duel/selectors'

const RedrawPhaseModal: FC<{ playerId: Player['id'] }> = ({ playerId }) => {
  const dispatch = useAppDispatch()

  const isPlayerReady = useAppSelector(getPlayerIsReady)

  const onSkipRedraw = () => {
    dispatch(completeRedraw(playerId))
  }

  return (
    <div style={{ width: 300 }}>
      <motion.h1 variants={SlideInOutContentVariants}>
        {redrawingPhaseModalTitle}
      </motion.h1>

      <motion.p variants={SlideInOutContentVariants}>
        {isPlayerReady ? opponentDecidingMessage : redrawMessage}
      </motion.p>

      {!isPlayerReady ? (
        <motion.div
          style={{ marginTop: '0.5rem' }}
          variants={SlideInOutContentVariants}
        >
          <Link onClick={onSkipRedraw}>{skipRedrawMessage}</Link>
        </motion.div>
      ) : null}
    </div>
  )
}

export default RedrawPhaseModal
