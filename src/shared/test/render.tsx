import { fireEvent, render as rtlRender, waitFor } from '@testing-library/react'
import { PropsWithChildren, ReactElement } from 'react'
import { Providers } from 'src/shared/components/Providers'

export const render = (ui: ReactElement) => {
  const Wrapper = ({ children }: PropsWithChildren) => (
    <Providers>{children}</Providers>
  )

  return {
    ...rtlRender(ui, { wrapper: Wrapper }),
    fireEvent,
    waitFor,
  }
}
