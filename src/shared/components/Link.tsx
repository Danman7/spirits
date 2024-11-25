import { motion } from 'motion/react'
import { FC, ReactNode } from 'react'

import styles from 'src/shared/styles/styles.module.css'

interface LinkProps {
  children?: ReactNode
  onClick: () => void
}

const Link: FC<LinkProps> = ({ children, onClick }) => (
  <motion.button
    className={styles.link}
    onClick={onClick}
    whileHover={{
      scale: 1.1,
      textDecoration: 'underline',
    }}
    whileTap={{ scale: 0.9 }}
  >
    {children}
  </motion.button>
)

export default Link
