import {
  queries,
  render as rtlRender,
  RenderOptions
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import { MainState } from '../state/StateTypes'
import { reducer, store } from '../state'
import { listenerMiddleware } from '../state/middleware'

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
              middleware: getDefaultMiddleware =>
                getDefaultMiddleware().prepend(listenerMiddleware.middleware),
              preloadedState
            })
          : store
      }
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

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

export { customRender as render }
