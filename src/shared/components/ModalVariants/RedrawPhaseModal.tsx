import { FC } from 'react'
import { motion } from 'framer-motion'

import Link from 'src/shared/components/Link'
import { redrawMessage, skipRedrawMessage } from 'src/Game/messages'
import { GamePhase, Player } from 'src/shared/redux/StateTypes'
import { SlideInOutContentVariants } from 'src/shared/utils/animations'
import { useAppDispatch } from 'src/shared/redux/hooks'
import { GameActions } from 'src/shared/redux/reducers/GameReducer'

const RedrawPhaseModal: FC<{ playerId: Player['id'] }> = ({ playerId }) => {
  const dispatch = useAppDispatch()

  const onSkipRedraw = () => {
    dispatch(GameActions.completeRedraw(playerId))
  }

  return (
    <>
      <motion.h3 variants={SlideInOutContentVariants}>
        {GamePhase.REDRAW}
      </motion.h3>
      <motion.div variants={SlideInOutContentVariants}>
        {redrawMessage}
      </motion.div>
      <Link onClick={onSkipRedraw}>{skipRedrawMessage}</Link>
    </>
  )
}

export default RedrawPhaseModal
