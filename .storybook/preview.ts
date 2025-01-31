import type { Preview } from '@storybook/react'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from '../src/shared/styles/global'
import { defaultTheme } from '../src/shared/styles/theme'

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
    themes: {
      default: defaultTheme,
    },
    defaultTheme: 'default',
    Provider: ThemeProvider,
    GlobalStyles,
  }),
]

export default preview
