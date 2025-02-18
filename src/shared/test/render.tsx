import {
  fireEvent,
  RenderOptions,
  render as rtlRender,
  waitFor,
} from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { initialState, UserProvider } from 'src/modules/user'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'
import { User } from 'src/shared/types'
import { ThemeProvider } from 'styled-components'

export function render(ui: ReactElement) {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <ThemeProvider theme={defaultTheme}>
      <GlobalStyles />
      {children}
    </ThemeProvider>
  )

  return {
    ...rtlRender(ui, { wrapper: Wrapper }),
    fireEvent,
    waitFor,
  }
}

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedUser?: User
}

export function renderWithUserProvider(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
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
