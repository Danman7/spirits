import {
  queries,
  render as rtlRender,
  RenderOptions
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { ThemeProvider } from 'styled-components'

import { GlobalStyles } from '../styles'
import { defaultTheme } from '../theme'
import { MainState } from '../state/StateTypes'
import { reducer, store } from '../state'

interface customRenderOptions extends RenderOptions {
  preloadedState?: MainState
}

const customRender = (
  ui: React.ReactElement,
  { preloadedState, ...renderOptions }: customRenderOptions = {}
) => {
  const Wrapper: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
    children
  }) => (
    <Provider
      store={
        preloadedState
          ? configureStore({
              reducer,
              preloadedState
            })
          : store
      }
    >
      <GlobalStyles />
      <ThemeProvider theme={defaultTheme}>{children}</ThemeProvider>
    </Provider>
  )

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
    queries: queries
  })
}

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

export { customRender as render }
