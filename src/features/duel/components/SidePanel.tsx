import { AnimatePresence, motion } from 'motion/react'
import { FC, ReactNode } from 'react'

import { SlideLeftVariants } from 'src/shared/animations'
import styles from 'src/shared/styles/styles.module.css'

interface SidePanelProps {
  children?: ReactNode
  onAnimationComplete?: () => void
  onExitComplete?: () => void
}

const SidePanel: FC<SidePanelProps> = ({
  children,
  onExitComplete,
  onAnimationComplete,
}) => (
  <AnimatePresence onExitComplete={onExitComplete}>
    {children ? (
      <motion.div
        initial="closed"
        exit="closed"
        className={styles.sidePanel}
        animate={children ? 'open' : 'closed'}
        variants={SlideLeftVariants}
        onAnimationComplete={onAnimationComplete}
      >
        {children}
      </motion.div>
    ) : null}
  </AnimatePresence>
)

export default SidePanel
