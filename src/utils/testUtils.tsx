import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { reducer, GameReducer } from 'src/redux'

const AllTheProviders = ({
  children,
  preloadedState
}: {
  children: React.ReactNode
  preloadedState?: Partial<GameReducer>
}) => {
  const store = configureStore({ reducer, preloadedState })

  return <Provider store={store}>{children}</Provider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
