import { Icons } from 'src/shared/components/Icon/AvailableIcons'
import { StyledIcon } from 'src/shared/components/Icon/Icon.styles'
import { IconName } from 'src/shared/components/Icon/Icon.types'
import { Color } from 'src/shared/shared.types'

interface IconProps {
  name: IconName
  color?: Color
  size?: string
}

export const Icon: React.FC<IconProps> = ({ color, name, size = '1em' }) => {
  const iconColor = color || '#3d2c29'
  const SvgIcon = Icons[name]

  return (
    <StyledIcon $color={iconColor} $size={size}>
      <SvgIcon />
    </StyledIcon>
  )
}
