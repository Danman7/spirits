import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { Card } from './Card'
import { mockCard } from './mocks'

const meta = {
  title: 'Card',
  component: Card,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {}
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    card: mockCard,
    onClick: fn()
  }
}

export const NotClickable: Story = {
  args: {
    card: mockCard
  }
}

export const FaceDown: Story = {
  args: {
    card: mockCard,
    isFaceDown: true
  }
}
