import type { Meta, StoryObj } from '@storybook/react'

import { AnimatedNumber } from 'src/shared/components'

const meta = {
  title: 'AnimatedNumber',
  component: AnimatedNumber,
  tags: ['Common', 'Stateless'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This is a stateless component for displaying dynamic numbers. It keeps track of how a given number has changed and shows the difference with a timed animation.',
      },
    },
  },
  args: { value: 3 },
  argTypes: {
    value: {
      description:
        'A plain number, which the component monitors for changes. Try updating it.',
    },
  },
} satisfies Meta<typeof AnimatedNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
