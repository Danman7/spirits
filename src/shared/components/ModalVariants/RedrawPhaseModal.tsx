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
    <>
      <motion.h3 variants={SlideInOutContentVariants}>
        {DuelPhase.REDRAW}
      </motion.h3>
      <motion.div variants={SlideInOutContentVariants}>
        {redrawMessage}
      </motion.div>
      <Link onClick={onSkipRedraw}>{skipRedrawMessage}</Link>
    </>
  )
}

export default RedrawPhaseModal
