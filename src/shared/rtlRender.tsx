import { render, RenderOptions } from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { Provider } from 'react-redux'

import { AppStore, setupStore, RootState } from 'src/app/store'
import { defaultTheme, GlobalStyles } from 'src/shared/styles'
import { ThemeProvider } from 'styled-components'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export function renderWithProviders(
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </Provider>
  )

  return {
    store,
    dispatchSpy: jest.spyOn(store, 'dispatch'),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
