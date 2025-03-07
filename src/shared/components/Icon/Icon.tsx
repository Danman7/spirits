import { IconName, Icons } from 'src/shared/components/Icon'
import { StyledIcon } from 'src/shared/components/Icon/IconStyles'
import { Color } from 'src/shared/SharedTypes'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'

export const Icon: React.FC<{
  name: IconName
  color?: Color
  isSmall?: boolean
}> = ({ color = defaultTheme.colors.text, name, isSmall = false }) => {
  const SvgIcon = Icons[name]

  return (
    <StyledIcon $color={color} $isSmall={isSmall}>
      <SvgIcon />
    </StyledIcon>
  )
}
