import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Button from 'src/shared/components/Button'

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    label: 'This is a button',
    type: 'default',
    onClick: fn(),
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['default', 'positive'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PositiveButton: Story = {
  args: {
    type: 'positive',
  },
}
