import { RenderOptions, render as rtlRender } from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { DuelProviderWithMiddleware } from 'src/modules/duel/components/DuelProviderWithMiddleware'
import { initialState as initialDuelState } from 'src/modules/duel/state/duelReducer'
import { DuelState } from 'src/modules/duel/DuelTypes'
import { Providers } from 'src/shared/components/Providers'
import { initialState as initialUserState } from 'src/shared/modules/user/state/userReducer'
import { User } from 'src/shared/modules/user/UserTypes'

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
      <DuelProviderWithMiddleware preloadedState={preloadedDuel}>
        {children}
      </DuelProviderWithMiddleware>
    </Providers>
  )

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions })
}
