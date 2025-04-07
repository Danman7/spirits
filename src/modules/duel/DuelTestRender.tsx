import {
  RenderOptions,
  render as rtlRender,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react'
import { act, PropsWithChildren, ReactElement } from 'react'

import { DuelProvider } from 'src/modules/duel/components'
import {
  DuelState,
  initialState as initialDuelState,
} from 'src/modules/duel/state'

import { Providers } from 'src/shared/components'
import { User, initialState as initialUserState } from 'src/shared/modules/user'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedUser?: User
  preloadedDuel?: DuelState
}

export const renderWithProviders = (
  ui: ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
) => {
  const {
    preloadedUser = initialUserState,
    preloadedDuel = initialDuelState,
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ({ children }: PropsWithChildren) => (
    <Providers preloadedUserState={preloadedUser}>
      <DuelProvider preloadedState={preloadedDuel}>{children}</DuelProvider>
    </Providers>
  )

  return {
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
    fireEvent,
    within,
    waitFor,
    act,
  }
}
