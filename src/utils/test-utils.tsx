import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styled-components'

import { GlobalStyles } from 'src/styles'
import { defaultTheme } from 'src/theme'
import { MainState } from 'src/state/types'
import { reducer, store } from 'src/state'
import { configureStore } from '@reduxjs/toolkit'

// eslint-disable-next-line react-refresh/only-export-components
const AllTheProviders = ({
  children,
  preloadedState
}: {
  children: React.ReactNode
  preloadedState?: MainState
}) => {
  return (
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
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

export { customRender as render }
