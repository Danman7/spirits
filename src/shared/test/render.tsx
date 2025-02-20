import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'
import { ThemeProvider } from 'styled-components'

export const render = (ui: ReactElement) => {
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
