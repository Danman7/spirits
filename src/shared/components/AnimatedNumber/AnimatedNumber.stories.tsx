import type { Meta, StoryObj } from '@storybook/react'
import { AnimatedNumber } from 'src/shared/components'

const meta = {
  title: 'AnimatedNumber',
  component: AnimatedNumber,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A simple component that keeps track of how a number has changed and animates the amount it is changed by floating above it.',
      },
    },
  },
  args: {
    value: 3,
  },
  argTypes: {
    value: {
      description:
        'Just pass a dynamic number and let the component watch its previous value.',
    },
  },
} satisfies Meta<typeof AnimatedNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const DifferentFontSize: Story = {
  decorators: [(story) => <div style={{ fontSize: '2rem' }}>{story()}</div>],
}
