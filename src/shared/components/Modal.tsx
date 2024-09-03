import { FC, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { FadeInOutVariants } from 'src/shared/utils/animations'

interface ModalProps {
  children?: ReactNode
  onAnimationComplete?: () => void
  onExitComplete?: () => void
}

const Modal: FC<ModalProps> = ({
  children,
  onAnimationComplete,
  onExitComplete
}) => (
  <AnimatePresence onExitComplete={onExitComplete}>
    {children && (
      <motion.div
        className={styles.modal}
        initial="closed"
        animate={children ? 'open' : 'closed'}
        variants={FadeInOutVariants}
        onAnimationComplete={onAnimationComplete}
        exit="closed"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

export default Modal
