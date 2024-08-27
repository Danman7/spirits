import { FC, MouseEventHandler } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'

import {
  FadeInOutVariants,
  ScaleInOutVariants
} from 'src/shared/utils/animations'
import { ButtonType } from 'src/shared/components/SharedComponentTypes'

interface ButtonProps {
  label: string
  type?: ButtonType
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button: FC<ButtonProps> = ({
  label,
  type = ButtonType.defaultButton,
  onClick
}) => {
  return (
    <AnimatePresence>
      {label && onClick && (
        <motion.button
          onClick={onClick}
          className={styles[type]}
          initial="closed"
          animate={label ? 'open' : 'closed'}
          variants={ScaleInOutVariants}
          whileHover={{
            borderBottomWidth: '6px',
            boxShadow: '0 0 2px 2px var(--hilight-color)'
          }}
          whileTap={{ borderBottomWidth: '2px' }}
          exit="closed"
          disabled={!onClick}
        >
          <motion.div variants={FadeInOutVariants}>{label}</motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export default Button
