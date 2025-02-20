import { RenderOptions, render as rtlRender } from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { DuelState, initialState as initialDuelState } from 'src/modules/duel'
import { DuelProviderWithMiddleware } from 'src/modules/duel/components'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'
import { User } from 'src/shared/types'
import { initialState as initialUserState, UserProvider } from 'src/shared/user'
import { ThemeProvider } from 'styled-components'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedUser?: User
  preloadedDuel?: DuelState
}

export const renderWithProviders = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const {
    preloadedUser = initialUserState,
    preloadedDuel = initialDuelState,
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <UserProvider preloadedState={preloadedUser}>
      <DuelProviderWithMiddleware preloadedState={preloadedDuel}>
        <ThemeProvider theme={defaultTheme}>
          <GlobalStyles />
          {children}
        </ThemeProvider>
      </DuelProviderWithMiddleware>
    </UserProvider>
  )

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
