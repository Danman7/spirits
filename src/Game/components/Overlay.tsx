import { FC } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import {
  SlideInOutContentVariants,
  ScaleInOutVariants
} from 'src/shared/utils/animations'

interface OverlayProps {
  message: string
  onAnimationComplete?: () => void
}

const Overlay: FC<OverlayProps> = ({ message, onAnimationComplete }) => (
  <AnimatePresence>
    {message && (
      <div className={styles.overlayWrapper}>
        <motion.div
          className={styles.overlay}
          initial="closed"
          animate={message ? 'open' : 'closed'}
          variants={ScaleInOutVariants}
          onAnimationComplete={onAnimationComplete}
          exit="closed"
        >
          <motion.h2 variants={SlideInOutContentVariants}>{message}</motion.h2>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
)

export default Overlay
