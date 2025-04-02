import { ReactNode } from 'react'

import { StyledLink } from 'src/shared/components/Link/Link.styles'

interface LinkProps {
  children: ReactNode
  onClick?: () => void
}

export const Link: React.FC<LinkProps> = ({ children, onClick }) => (
  <StyledLink onClick={onClick}>{children}</StyledLink>
)
