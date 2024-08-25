import { FC } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import {
  getActivePlayerId,
  getBottomPlayer,
  getGameTurn
} from 'src/Game/GameSelectors'
import { getOverlayMessage } from 'src/Game/GameUtils'
import styles from 'src/shared/styles/styles.module.css'
import * as Animations from 'src/shared/utils/animations'

interface OverlayProps {
  onAnimationComplete?: () => void
}

const Overlay: FC<OverlayProps> = ({ onAnimationComplete }) => {
  const bottomPlayer = useSelector(getBottomPlayer)
  const activePlayerId = useSelector(getActivePlayerId)
  const turn = useSelector(getGameTurn)

  const isPlayerTurn = bottomPlayer?.id === activePlayerId
  const isFirstTurn = turn === 1

  const message = getOverlayMessage(isPlayerTurn, isFirstTurn)

  return (
    <motion.div
      className={styles.overlay}
      onAnimationComplete={onAnimationComplete}
      {...Animations.fadeInAndOut}
    >
      <motion.h1 {...Animations.slideLeftToRight}>{message}</motion.h1>
    </motion.div>
  )
}

export default Overlay
