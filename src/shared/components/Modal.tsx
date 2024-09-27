import { FC, ReactNode } from 'react'
import { AnimatePresence, motion, MotionStyle } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { FadeInOutVariants } from 'src/shared/animations'

interface ModalProps {
  children?: ReactNode
  style?: MotionStyle
}

const Modal: FC<ModalProps> = ({ children, style }) => (
  <AnimatePresence>
    {children && (
      <motion.div
        className={styles.modal}
        initial="closed"
        style={style}
        animate={children ? 'open' : 'closed'}
        variants={FadeInOutVariants}
        exit="closed"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)

export default Modal
