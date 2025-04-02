import { useTheme } from 'styled-components'

import { Icons } from 'src/shared/components/Icon/AvailableIcons'
import { StyledIcon } from 'src/shared/components/Icon/Icon.styles'
import { IconName } from 'src/shared/components/Icon/Icon.types'
import { Color } from 'src/shared/shared.types'

interface IconProps {
  name: IconName
  color?: Color
  isSmall?: boolean
}

export const Icon: React.FC<IconProps> = ({ color, name, isSmall = false }) => {
  const { colors } = useTheme()

  const iconColor = color || colors.text
  const SvgIcon = Icons[name]

  return (
    <StyledIcon $color={iconColor} $isSmall={isSmall}>
      <SvgIcon />
    </StyledIcon>
  )
}
