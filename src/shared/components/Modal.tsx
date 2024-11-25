import { AnimatePresence, motion, MotionStyle } from 'motion/react'
import { FC, ReactNode } from 'react'

import { FadeInOutStaggerVariants } from 'src/shared/animations'
import styles from 'src/shared/styles/styles.module.css'

interface ModalProps {
  children?: ReactNode
  style?: MotionStyle
  onExitComplete?: () => void
}

const Modal: FC<ModalProps> = ({ children, style, onExitComplete }) => (
  <AnimatePresence onExitComplete={onExitComplete}>
    {children ? (
      <motion.div
        key="modal-overlay"
        initial="closed"
        exit="closed"
        className={styles.overlay}
        animate={children ? 'open' : 'closed'}
        variants={FadeInOutStaggerVariants}
      >
        <motion.div
          initial="closed"
          exit="closed"
          style={style}
          className={styles.modal}
          animate={children ? 'open' : 'closed'}
          variants={FadeInOutStaggerVariants}
        >
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
)

export default Modal
