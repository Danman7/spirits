import {
  queries,
  render as rtlRender,
  RenderOptions
} from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'

import duelReducer from 'src/features/duel/slice'
import { listenerMiddleware } from 'src/app/listenerMiddleware'
import { RootState } from 'src/app/store'

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
        reducer: {
          duel: duelReducer
        },
        middleware: getDefaultMiddleware =>
          getDefaultMiddleware().prepend(listenerMiddleware.middleware),
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

// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'

export { customRender as render }
