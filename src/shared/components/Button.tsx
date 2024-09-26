import { FC, MouseEventHandler } from 'react'
import { motion } from 'framer-motion'

import styles from 'src/shared/styles/styles.module.css'

import { ButtonType } from 'src/shared/components/SharedComponentTypes'

export interface ButtonProps {
  label: string
  type?: ButtonType
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const Button: FC<ButtonProps> = ({
  label,
  type = ButtonType.defaultButton,
  onClick,
}) => (
  <motion.button
    onClick={onClick}
    className={styles[type]}
    whileHover={{
      borderBottomWidth: '6px',
      boxShadow: '0 0 2px 2px var(--hilight-color)',
      y: -2,
    }}
    whileTap={{ borderBottomWidth: '2px', y: 2 }}
  >
    {label}
  </motion.button>
)

export default Button
