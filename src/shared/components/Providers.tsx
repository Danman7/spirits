import { ReactNode } from 'react'
import { UserProvider } from 'src/shared/modules/user/components/UserProvider'
import { User } from 'src/shared/modules/user/types'
import { GlobalStyles } from 'src/shared/styles/global'
import { defaultTheme } from 'src/shared/styles/theme'
import { ThemeProvider } from 'styled-components'

interface ProvidersProps {
  children: ReactNode
  preloadedUserState?: User
}

export const Providers: React.FC<ProvidersProps> = ({
  children,
  preloadedUserState,
}) => (
  <UserProvider preloadedState={preloadedUserState}>
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  </UserProvider>
)
