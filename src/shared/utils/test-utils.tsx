import {
  queries,
  render as rtlRender,
  RenderOptions
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import store from 'src/shared/redux/store'
import { reducer } from 'src/shared/redux/reducer'
import { listenerMiddleware } from 'src/shared/redux/listenerMiddleware'
import { MainState } from 'src/shared/redux/StateTypes'

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
