import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'

import Button from 'src/shared/components/Button'
import { ButtonType } from 'src/shared/components/SharedComponentTypes'

const meta = {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  args: {
    label: 'This is a button',
    type: ButtonType.defaultButton,
    onClick: fn()
  },
  argTypes: {
    type: {
      control: 'select',
      options: [ButtonType.defaultButton, ButtonType.positiveButton]
    }
  }
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const PositiveButton: Story = {
  args: {
    type: ButtonType.positiveButton
  }
}
