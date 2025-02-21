import type { Meta, StoryObj } from '@storybook/react'
import { ColoredNumber } from 'src/shared/components/ColoredNumber'

const meta = {
  title: 'ColoredNumber',
  component: ColoredNumber,
  tags: ['Common', 'Stateless'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'This component takes a number and a base to compare it with. It colors the number differently depending on whether the current is above or below the base number.',
      },
    },
  },
  args: {
    current: 3,
    base: 3,
  },
  argTypes: {
    current: {
      description: 'The current dynamic value of the number.',
    },
    base: {
      description: 'The base number to compare it with.',
    },
  },
} satisfies Meta<typeof ColoredNumber>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Positive: Story = {
  args: {
    base: 3,
    current: 4,
  },
}

export const Negative: Story = {
  args: {
    base: 3,
    current: 2,
  },
}
