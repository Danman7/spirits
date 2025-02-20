import { RenderOptions, render as rtlRender } from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'
import { User } from 'src/shared/types'
import { initialState, UserProvider } from 'src/shared/user'
import { ThemeProvider } from 'styled-components'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedUser?: User
}

export const renderWithUserProvider = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const { preloadedUser: preloadedState = initialState, ...renderOptions } =
    extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <UserProvider preloadedState={preloadedState}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </UserProvider>
  )

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
