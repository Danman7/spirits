import { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

import { User } from 'src/shared/modules/user'
import { UserProvider } from 'src/shared/modules/user/components/UserProvider'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'

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
