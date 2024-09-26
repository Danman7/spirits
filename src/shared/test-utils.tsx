import {
  queries,
  render as rtlRender,
  RenderOptions
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { RootState, storeConfiguration } from 'src/app/store'

interface customRenderOptions extends RenderOptions {
  preloadedState?: RootState
}

const customRender = (
  ui: React.ReactElement,
  { preloadedState, ...renderOptions }: customRenderOptions = {}
) => {
  const Wrapper: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
    children
  }) => (
    <Provider
      store={configureStore({
        ...storeConfiguration,
        preloadedState
      })}
    >
      {children}
    </Provider>
  )

  return rtlRender(ui, {
    wrapper: Wrapper,
    ...renderOptions,
    queries: queries
  })
}

export * from '@testing-library/react'

export { customRender as render }
