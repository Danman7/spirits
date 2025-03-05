import { IconName, Icons } from 'src/shared/components/Icon'
import { StyledIcon } from 'src/shared/components/Icon/styles'
import { defaultTheme } from 'src/shared/styles/theme'

export const Icon: React.FC<{
  name: IconName
  color?: React.CSSProperties['fill']
  isSmall?: boolean
}> = ({ color = defaultTheme.colors.text, name, isSmall = false }) => {
  const SvgIcon = Icons[name]

  return (
    <StyledIcon $color={color} $isSmall={isSmall}>
      <SvgIcon />
    </StyledIcon>
  )
}
