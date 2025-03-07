import { ReactNode } from 'react'
import { UserProvider } from 'src/shared/modules/user/components/UserProvider'
import { User } from 'src/shared/modules/user/UserTypes'
import { GlobalStyles } from 'src/shared/styles/GlobalStyles'
import { defaultTheme } from 'src/shared/styles/DefaultTheme'
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
