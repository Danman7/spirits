import { FC, ReactNode } from 'react'

import styles from 'src/shared/styles/components.module.css'

interface LinkProps {
  children: ReactNode
  onClick?: () => void
}

export const Link: FC<LinkProps> = ({ children, onClick }) => (
  <button className={styles.link} onClick={onClick}>
    {children}
  </button>
)
