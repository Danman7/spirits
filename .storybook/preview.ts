import type { Preview } from '@storybook/react'

import 'src/shared/styles/global.css'

const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [{ name: 'Paper', value: 'var(--background-color)' }],
      default: 'Paper',
    },
  },
}

export default preview
