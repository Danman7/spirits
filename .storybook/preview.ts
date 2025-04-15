import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react'
import { ThemeProvider } from 'styled-components'

import { defaultTheme } from '../src/shared/styles/DefaultTheme'
import { GlobalStyles } from '../src/shared/styles/GlobalStyles'

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [{ name: 'Paper', value: 'var(--background-color)' }],
      default: 'Paper',
    },
  },
}

export const decorators = [
  withThemeFromJSXProvider({
    themes: { default: defaultTheme },
    defaultTheme: 'default',
    Provider: ThemeProvider,
    GlobalStyles,
  }),
]

export default preview
