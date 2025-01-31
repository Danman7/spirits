import { FC, ReactNode } from 'react'
import { StyledLink } from 'src/shared/components'

interface LinkProps {
  children: ReactNode
  onClick?: () => void
}

export const Link: FC<LinkProps> = ({ children, onClick }) => (
  <StyledLink onClick={onClick}>{children}</StyledLink>
)
