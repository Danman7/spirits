import { FC } from 'react'
import { motion } from 'framer-motion'

import Link from 'src/shared/components/Link'
import { SlideInOutContentVariants } from 'src/shared/animations'
import { useAppDispatch } from 'src/app/store'
import { DuelPhase, Player } from 'src/features/duel/types'
import { completeRedraw } from 'src/features/duel/slice'
import { redrawMessage, skipRedrawMessage } from 'src/features/duel/messages'

const RedrawPhaseModal: FC<{ playerId: Player['id'] }> = ({ playerId }) => {
  const dispatch = useAppDispatch()

  const onSkipRedraw = () => {
    dispatch(completeRedraw(playerId))
  }

  return (
    <div style={{ width: 300 }}>
      <motion.h1 variants={SlideInOutContentVariants}>
        {DuelPhase.REDRAW}
      </motion.h1>
      <motion.p variants={SlideInOutContentVariants}>{redrawMessage}</motion.p>
      <motion.div
        style={{ marginTop: '0.5rem' }}
        variants={SlideInOutContentVariants}
      >
        <Link onClick={onSkipRedraw}>{skipRedrawMessage}</Link>
      </motion.div>
    </div>
  )
}

export default RedrawPhaseModal
