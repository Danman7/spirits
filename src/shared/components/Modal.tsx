import { FC, ReactNode } from 'react'
import { AnimatePresence, motion, MotionStyle } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { FadeInOutVariants } from 'src/shared/animations'

interface ModalProps {
  children?: ReactNode
  style?: MotionStyle
  hasOverlay?: boolean
}

const Modal: FC<ModalProps> = ({ children, style, hasOverlay }) => (
  <AnimatePresence>
    {children ? (
      <motion.div
        key="modal"
        className={styles.modal}
        initial="closed"
        style={style}
        animate={children ? 'open' : 'closed'}
        variants={FadeInOutVariants}
        exit="closed"
      >
        {children}
      </motion.div>
    ) : null}
    {children && hasOverlay ? (
      <motion.div
        key="overlay"
        className={styles.overlay}
        animate={children ? 'open' : 'closed'}
        variants={FadeInOutVariants}
        initial="closed"
        exit="closed"
      />
    ) : null}
  </AnimatePresence>
)

export default Modal
