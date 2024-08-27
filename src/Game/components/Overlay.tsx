import { FC } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import {
  FadeInAndOutAnimation,
  SlideLeftToRightAnimation
} from 'src/shared/utils/animations'

interface OverlayProps {
  message: string
  onAnimationComplete?: () => void
}

const Overlay: FC<OverlayProps> = ({ message, onAnimationComplete }) => (
  <AnimatePresence>
    {message && (
      <motion.div
        className={styles.overlay}
        onAnimationComplete={onAnimationComplete}
        {...FadeInAndOutAnimation}
      >
        <motion.h1 {...SlideLeftToRightAnimation}>{message}</motion.h1>
      </motion.div>
    )}
  </AnimatePresence>
)

export default Overlay
