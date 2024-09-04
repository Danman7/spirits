import { FC, ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'
import { FadeInOutVariants } from 'src/shared/utils/animations'

interface ModalProps {
  children?: ReactNode
}

const Modal: FC<ModalProps> = ({ children }) => (
  <AnimatePresence>
    {children && (
      <motion.div
        className={styles.modal}
        initial="closed"
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
